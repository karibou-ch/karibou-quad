    this.databaseService.issues_per_dates(this.name).subscribe(
      record => {
        let dataset1 = {'label':[], 'score': [], 'produits manquants': [], 'erreurs qualité (fulfilled)': [], 'erreurs qualité (failure)': []};
        let dataset2 = {'label':[], 'nombre de transactions': [], 'nombre de clients': [], 'nombre de produits': [], 'chiffre d\'affaire': [], 'différence de prix': []};
          _
          .chain(record)
          .sortBy( r => r.month)
          .sortBy( r => r.year)
          .forEach( r => {
            let key = r.month + '.' + r.year;

            dataset1['label'].push(key);
            dataset1['score'].push(r.score);
            dataset1['produits manquants'].push(r.issue_missing_product);
            dataset1['erreurs qualité (fulfilled)'].push(r.issue_quality_fulfilled);
            dataset1['erreurs qualité (failure)'].push(r.issue_quality_failure);


            dataset2['label'].push(key);
            dataset2['nombre de transactions'].push(r['nb_transactions']);
            dataset2['nombre de clients'].push(r['nb_customers']);
            dataset2['nombre de produits'].push(r['nb_items']);
            dataset2['chiffre d\'affaire'].push(r['finalprice']);
            dataset2['différence de prix'].push(r['price_diff']);


          })
          .value();

        this.issuesPerDate = dataset1;
        this.amountPerDate = dataset2;
      }
    );

    //
    // mongodb 3.4
    var match_vendor={ 'items.vendor': '' };match_vendor={};
    var stats=db.orders.aggregate([
            { $match: { 'payment.status': 'paid' } },
            {$unwind: "$items"},
            {$match: match_vendor},
            {$addFields: {
                // 
                // (issue===issue_missing_product || !issue)&& status===failure
                issue_missing_product: {
                    $cond: [ {$or: [ { 
                      $eq: ['$items.issue', 'issue_missing_product'] }, 
                      {$and: [ 
                          {$eq: ['$items.status', 'failure'] }, 
                          {$eq: ['$items.issue', 'undefined'] 
                      }]}          
                    ]} , 1, 0 ]
                },
                // 
                // issue===issue_quality&&status===failure
                issue_quality_failure: {
                    $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_quality'] }, {$eq: ['$items.status', 'failure'] }]}, 1, 0 ]
                },
                issue_quality_fulfilled: {
                    $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_quality'] }, {$eq: ['$items.status', 'fulfilled'] }]}, 1, 0 ]
                },
                customer_id: '$customer.id'
              }
            },
            {$addFields: { date: '$shipping.when' }},
            {
              $project: {
                date: 1,
                issue_missing_product: 1,
                issue_quality_failure: 1,
                issue_quality_fulfilled: 1,
                oid: 1,
                customer_id: 1,
                deltaprice: { $subtract: ['$items.finalprice', '$items.estimatedprice'] },
                finalprice: '$items.finalprice',
                score: {
                    $add: [
                        { $multiply: ['$issue_missing_product', 1] },
                        { $multiply: ['$issue_quality_failure', 2] },
                        { $multiply: ['$issue_quality_fulfilled', 4] }
                    ]
                }
              }
            },
            {
                $group:{
                    _id: {year: {$year: '$date'}, month: {$month: '$date'}},
                    issue_missing_product: {$sum: '$issue_missing_product'},
                    issue_quality_failure: {$sum: '$issue_quality_failure'},
                    issue_quality_fulfilled: {$sum: '$issue_quality_fulfilled'},
                    score: {$sum: '$score'},
                    items_sz: {$sum: 1},
                    orders: {$addToSet: "$oid"},
                    customers: {$addToSet: "$customer_id"},
                    deltaprice: {$sum: '$deltaprice'},
                    finalprice: {$sum: '$finalprice'}
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    issue_missing_product: 1,
                    issue_quality_failure: 1,
                    issue_quality_fulfilled: 1,
                    score: 1,
                    items_sz: 1,
                    orders_sz: {$size: '$orders'},
                    customers_sz: {$size: '$customers'},
                    deltaprice: 1,
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


    //
    // mongodb 3.0
    var match_vendor={ 'items.vendor': '' };match_vendor={};
    var stats=db.orders.aggregate([
            { $match: { 'payment.status': 'paid' } },
            {$unwind: "$items"},
            {$match: match_vendor},
            {$addFields: {
                // 
                // (issue===issue_missing_product || !issue)&& status===failure
                issue_missing_product: {
                    $cond: [ {$or: [ { 
                      $eq: ['$items.issue', 'issue_missing_product'] }, 
                      {$and: [ 
                          {$eq: ['$items.status', 'failure'] }, 
                          {$eq: ['$items.issue', 'undefined'] 
                      }]}          
                    ]} , 1, 0 ]
                },
                // 
                // issue===issue_quality&&status===failure
                issue_quality_failure: {
                    $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_quality'] }, {$eq: ['$items.status', 'failure'] }]}, 1, 0 ]
                },
                issue_quality_fulfilled: {
                    $cond: [ { $and: [{ $eq: ['$items.issue', 'issue_quality'] }, {$eq: ['$items.status', 'fulfilled'] }]}, 1, 0 ]
                },
                customer_id: '$customer.id'
              }
            },
            {$addFields: { date: '$shipping.when' }},
            {
              $project: {
                date: 1,
                issue_missing_product: 1,
                issue_quality_failure: 1,
                issue_quality_fulfilled: 1,
                oid: 1,
                customer_id: 1,
                deltaprice: { $subtract: ['$items.finalprice', '$items.estimatedprice'] },
                finalprice: '$items.finalprice',
                score: {
                    $add: [
                        { $multiply: ['$issue_missing_product', 1] },
                        { $multiply: ['$issue_quality_failure', 2] },
                        { $multiply: ['$issue_quality_fulfilled', 4] }
                    ]
                }
              }
            },
            {
                $group:{
                    _id: {year: {$year: '$date'}, month: {$month: '$date'}},
                    issue_missing_product: {$sum: '$issue_missing_product'},
                    issue_quality_failure: {$sum: '$issue_quality_failure'},
                    issue_quality_fulfilled: {$sum: '$issue_quality_fulfilled'},
                    score: {$sum: '$score'},
                    items_sz: {$sum: 1},
                    orders: {$addToSet: "$oid"},
                    customers: {$addToSet: "$customer_id"},
                    deltaprice: {$sum: '$deltaprice'},
                    finalprice: {$sum: '$finalprice'}
                }
            },
            {
                $project: {
                    _id: 0,
                    year: '$_id.year',
                    month: '$_id.month',
                    issue_missing_product: 1,
                    issue_quality_failure: 1,
                    issue_quality_fulfilled: 1,
                    score: 1,
                    items_sz: 1,
                    orders_sz: {$size: '$orders'},
                    customers_sz: {$size: '$customers'},
                    deltaprice: 1,
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