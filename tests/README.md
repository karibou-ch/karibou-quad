configure and run:
```
docker-compose build
docker-compose up -d
```

use mongodb:
```
docker exec -it docker_mongo-karibou_1 mongo admin
```

connect to the bash container:
```
docker exec -i -t docker_mongo-karibou_1 bash
```


document to record:
```
db.orders.aggregate( [ { $unwind: "$items"}, { $project: { vendors: 0 } } ] )
```


find customer id:
```
db.orders.aggregate( [ { $unwind: "$items"}, { $project: { id: { $eq: ["$oid", 2000003] }, items: 1 } } ] )
```

amount by vendors:

```
db.orders.aggregate( [{ $unwind: "$items" }, {$group: {_id: "$items.vendor", amount: { $sum: "$items.finalprice" } } }, {$sort: {amount: -1}} ] )
```


count amount and missing product:
```
db.orders.aggregate( [{ $unwind: "$items" }, { $project: {items: 1, issue_missing_product: {$cond: [ {$eq: ['$items.issue', 'issue_missing_product']}, 1, 0]  } } }, {$group: {_id: "$items.vendor", amount: { $sum: "$items.finalprice" }, issue: {$sum: '$issue_missing_product'} } } ] )
```
