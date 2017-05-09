const _ = require('lodash');

var Transactions = connectionsubject.model('', {}, 'orders');

module.exports = function(app) {


    app.get('/vendor/:id?', (req, res) => {

        const searchVendorId = req.params.id === undefined ? {} : { 'items.vendor': req.params.id };

        Transactions
            .aggregate( 
                [ 
                    { 
                        $unwind: "$items"
                    },
                    {
                        $match: searchVendorId
                    },
                    {
                        $project: {
                            items: 1,
                            'customer': 1,
                            issue_missing_product: {
                                $cond: [ { $or: [ { $eq: ['$items.issue', 'issue_missing_product'] }, {$and: [ {$eq: ['$items.status', 'failure'] }, {$eq: ['$items.issue', 'undefined'] }] }          ] } , 1, 0 ]
                            },
                            issue_wrong_product_quality_failure: {
                                $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_wrong_product_quality'] }, {$eq: ['$items.status', 'failure'] }]}, 1, 0 ]
                            },
                            issue_wrong_product_quality_fulfilled: {
                                $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_wrong_product_quality'] }, {$eq: ['$items.status', 'fulfilled'] }]}, 1, 0 ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: { vendor: '$items.vendor', customer_id: '$customer.id', customer_pseudo: '$customer.pseudo' },
                            amount: {$sum: '$items.finalprice'},
                            issue_missing_product: {$sum: '$issue_missing_product'},
                            issue_wrong_product_quality_failure: {$sum: '$issue_wrong_product_quality_failure'},
                            issue_wrong_product_quality_fulfilled: {$sum: '$issue_wrong_product_quality_fulfilled'},
                            nb_items: {$sum: 1}
                        }
                    },
                    {
                        $group: {
                            _id: '$_id.vendor',
                            customers: {
                                $sum: 1
                            },
                            issue_missing_product: {$sum: '$issue_missing_product'},
                            issue_wrong_product_quality_failure: {$sum: '$issue_wrong_product_quality_failure'},
                            issue_wrong_product_quality_fulfilled: {$sum: '$issue_wrong_product_quality_fulfilled'},
                            nb_items: {$sum: '$nb_items'},
                            customers_details: {
                                $push: {
                                    id: '$_id.customer_id',
                                    pseudo: '$_id.customer_pseudo',
                                    issue_missing_product: '$issue_missing_product',
                                    issue_wrong_product_quality_failure: '$issue_wrong_product_quality_failure',
                                    issue_wrong_product_quality_fulfilled: '$issue_wrong_product_quality_fulfilled',
                                    nb_items: '$nb_items'
                                } 
                            }
                        }
                    }
                ],
                (err, subjectDetails) =>  { 
                    if (err) {
                        res.send(err);
                    }
                    res.json(_
                        .chain(subjectDetails)
                        .map( 
                            i => { 
                                i['score'] = i['issue_missing_product'] + i['issue_wrong_product_quality_fulfilled']*2 + i['issue_wrong_product_quality_fulfilled']*4;
                                i['score_rate'] = i['score'] / i['nb_items'] * 100;
                                _.map(i['customers_details'], ( i => {
                                    i['score'] = i['issue_missing_product'] + i['issue_wrong_product_quality_fulfilled']*2 + i['issue_wrong_product_quality_fulfilled']*4;
                                    i['score_rate'] = i['score'] / i['nb_items'] * 100;
                                    return i;
                                }));
                                return i;
                            }
                        )
                        .sortBy( i => i['score_rate'])
                        .reverse()
                    );
                }
        );

    });

    app.get('/vendors-consumers', (req, res) => {
        Transactions
            .aggregate( 
                [ 
                    { 
                        $unwind: "$items" 
                    },
                    {
                        $project: {
                            items: 1,
                            'customer.id': 1,
                            issue_missing_product: {
                                $cond: [
                                    { $eq: ['$items.issue', 'issue_missing_product']}, 1, 0]  } 
                        } 
                    },
                    {
                        $group: { 
                            _id: { 
                                name: "$items.vendor",
                                customer_id: "$customer.id" }
                            , 
                            amount: { 
                                $sum: "$items.finalprice" 
                            },
                            issue: {
                                $sum: '$issue_missing_product'
                            }, 
                            nb_products: {
                                $sum: 1
                            }  
                        } 
                    } 
                ],
                (err, subjectDetails) =>  { 
                    if (err) {
                        res.send(err);
                    }
                    res.json(
                        _.map(subjectDetails, record => {
                            record['customer_id'] = record['_id']['customer_id'];
                            record['vendor_name'] = record['_id']['name'];
                            delete record['_id'];
                            return record;
                        })
                    );
                }
        );
    });
    app.get('/transaction', (req, res) => {
        // use mongoose to get all nerds in the database
        Transactions
            .aggregate( 
                [ { $unwind: "$items"}, { $project: { vendors: 0 } } ],
                (err, subjectDetails) =>  { 
                    if (err) 
                        res.send(err);
                    res.json(subjectDetails); // return all nerds in JSON format
                }
        );
    });

    /*
    app.get('*', function(req, res) {
        res.sendfile('./public/login.html');
    });
    */
}
