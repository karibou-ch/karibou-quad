var Transactions = connectionsubject.model('', {}, 'orders');

module.exports = function(app) {

    app.get('/vendor', (req, res) => {
        Transactions
            .aggregate( 
                [ 
                    { 
                        $unwind: "$items"
                    },
                    {
                        $project: {
                            items: 1,
                            issue_missing_product: {
                                $cond: [ { $or: [ { $eq: ['$items.issue', 'issue_missing_product'] }, {$eq: ['$items.status', 'failure'] } ] } , 1, 0 ]
                            },
                            issue_wrong_product_quality: {
                                $cond: [ { $eq: ['$items.issue', 'issue_wrong_product_quality'] }, 1, 0 ]
                            }
                        }
                    },
                    {
                        $group: {
                            _id: '$items.vendor',
                            amount: {$sum: '$items.finalprice'},
                            issue_missing_product: {$sum: '$issue_missing_product'},
                            issue_wrong_product_quality: {$sum: '$issue_wrong_product_quality'}
                        }
                    }
                ],
                (err, subjectDetails) =>  { 
                    if (err) 
                        res.send(err);
                    res.json(subjectDetails); // return all nerds in JSON format
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
