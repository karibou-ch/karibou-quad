configure and run MongoDB 3.4 with dump:
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


