const _ = require('lodash');

var Transactions = connectionsubject.model('', {}, 'orders');

/**
 * The API Documentation is available at: https://github.com/karibou-ch/karibou-quad/wiki/API-Documentation
 */
module.exports = function(app) {

    /**
     * :vendorid - the vendor's id (string)
     * :customerid - the customer's id (number)
     */
    app.get('/transactions/:vendorid/:customerid', (req, res) => {

        Transactions
            .aggregate([
                    {
                        $match: {
                            'customer.id': +req.params['customerid'],
                            'items.vendor': req.params['vendorid']
                        },
                    }
                ],
                (err, subjectDetails) =>  { 
                    if (err) {
                        res.send(err);
                    }
                    res.json(subjectDetails);
                });
    });

    /**
     * :id - the vendor's id (string)
     */
    app.get('/vendors/:id/date', (req, res) => {
        Transactions
            .aggregate([
                    {$unwind: "$items"},
                    {$match: { 'items.vendor': req.params.id }},
                    {
                        $addFields: {
                            issue_missing_product: {
                                $cond: [ { $or: [ { $eq: ['$items.issue', 'issue_missing_product'] }, {$and: [ {$eq: ['$items.status', 'failure'] }, {$eq: ['$items.issue', 'undefined'] }] }          ] } , 1, 0 ]
                            },
                            issue_wrong_product_quality_failure: {
                                $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_wrong_product_quality'] }, {$eq: ['$items.status', 'failure'] }]}, 1, 0 ]
                            },
                            issue_wrong_product_quality_fulfilled: {
                                $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_wrong_product_quality'] }, {$eq: ['$items.status', 'fulfilled'] }]}, 1, 0 ]
                            },
                            customer_id: '$customer.id'
                        }
                    },
                    {$addFields: { date: '$shipping.when' }},
                    {
                        $project: {
                            date: 1,
                            issue_missing_product: 1,
                            issue_wrong_product_quality_failure: 1,
                            issue_wrong_product_quality_fulfilled: 1,
                            oid: 1,
                            customer_id: 1,
                            price_diff: { $subtract: ['$items.finalprice', '$items.estimatedprice'] },
                            finalprice: '$items.finalprice',
                            score: {
                                $add: [
                                    { $multiply: ['$issue_missing_product', 1] },
                                    { $multiply: ['$issue_wrong_product_quality_failure', 2] },
                                    { $multiply: ['$issue_wrong_product_quality_fulfilled', 4] }
                                ]
                            }
                        }
                    },
                    {
                        $group:{
                            _id: {year: {$year: '$date'}, month: {$month: '$date'}},
                            issue_missing_product: {$sum: '$issue_missing_product'},
                            issue_wrong_product_quality_failure: {$sum: '$issue_wrong_product_quality_failure'},
                            issue_wrong_product_quality_fulfilled: {$sum: '$issue_wrong_product_quality_fulfilled'},
                            score: {$sum: '$score'},
                            nb_items: {$sum: 1},
                            transactions_set_id: {$addToSet: "$oid"},
                            clients_set_id: {$addToSet: "$customer_id"},
                            price_diff: {$sum: '$pricediff'},
                            finalprice: {$sum: '$finalprice'}
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            year: '$_id.year',
                            month: '$_id.month',
                            issue_missing_product: 1,
                            issue_wrong_product_quality_failure: 1,
                            issue_wrong_product_quality_fulfilled: 1,
                            score: 1,
                            nb_items: 1,
                            nb_transactions: {$size: '$transactions_set_id'},
                            nb_customers: {$size: '$clients_set_id'},
                            price_diff: 1,
                            finalprice: 1
                        }
                    }
                ],
                (err, subjectDetails) =>  {
                    if (err) {
                        res.send(err);
                    }

                    // TODO (jca): Move some logic here (score, sort, ...)
                    // see doc for improvements at:
                    // https://github.com/karibou-ch/karibou-quad/wiki/Developpement#user-content-améliorations-et-poursuite-des-travaux

                    res.json(subjectDetails);

                }
            );
    });

    /**
     * :id - the vendors' id (string)
     */
    app.get('/vendors/:id?', (req, res) => {

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
                        $addFields: {
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
                            nb_items: {$sum: 1},
                            nb_transactions: {$addToSet: "$oid"},
                        }
                    },
                    {
                        $addFields: {
                            nb_transactions: {$size:"$nb_transactions"}
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
                            amount: {$sum: '$amount'},
                            nb_items: {$sum: '$nb_items'},
                            nb_transactions: {$sum: '$nb_transactions'},
                            customers_details: {
                                $push: {
                                    id: '$_id.customer_id',
                                    pseudo: '$_id.customer_pseudo',
                                    amount: '$amount',
                                    issue_missing_product: '$issue_missing_product',
                                    issue_wrong_product_quality_failure: '$issue_wrong_product_quality_failure',
                                    issue_wrong_product_quality_fulfilled: '$issue_wrong_product_quality_fulfilled',
                                    nb_items: '$nb_items',
                                    nb_transactions: '$nb_transactions',
                                    score: {
                                        $add: [
                                            { $multiply: ['$issue_missing_product', 1] }, 
                                            { $multiply: ['$issue_wrong_product_quality_failure', 2] }, 
                                            { $multiply: ['$issue_wrong_product_quality_fulfilled', 4] }
                                        ]
                                    },
                                    score_rate: {
                                        $multiply: [
                                        {
                                            $divide: [ {
                                            $add: [
                                                { $multiply: ['$issue_missing_product', 1] }, 
                                                { $multiply: ['$issue_wrong_product_quality_failure', 2] }, 
                                                { $multiply: ['$issue_wrong_product_quality_fulfilled', 4] }
                                            ]},
                                            '$nb_items']
                                        }, 100]
                                    }
                                } 
                            }
                        }
                    },
                    {
                        $addFields: {
                            score: {
                                $sum: '$customers_details.score'
                            }
                        }
                    }
                ],
                (err, subjectDetails) =>  { 
                    if (err) {
                        res.send(err);
                    }

                    // TODO (jca): Move some logic here (score, sort, ...)
                    // see doc for improvements at:
                    // https://github.com/karibou-ch/karibou-quad/wiki/Developpement#user-content-améliorations-et-poursuite-des-travaux

                    res.json(subjectDetails);
                }
        );

    });

}
