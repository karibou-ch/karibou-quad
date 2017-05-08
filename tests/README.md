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
