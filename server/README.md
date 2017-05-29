# Summary
This REST Api Server is used to map the data. Routes are provided for clients to show statistics on a dashboard. If you would use another mapping technic, please keep the same routes name and the same response structure.

## Prequisite
 * [Installation of docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
 * [Installing Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)

## Install guide
1a) Simulate the mongodb 3.4 database and import data from JSON:
```
cd ../test
docker-compose build
docker-compose up -d
```

1b) If you already have MongoDB 3.4, import `order.json` and update the date
fields to ISODate:
```
mongoimport --host XYZ --db order --collection orders --type json --file orders.json --jsonArray 
mongo --host XYZ order --eval 'db.orders.find( { "customer.id.floatApprox": { $exists: true } } ).forEach( tr => db.orders.update({_id: tr._id},{$set:{"customer.id": tr.customer.id.floatApprox}}  ) )' && mongo --host mongo-karibou order --eval 'db.orders.find().forEach( tr => db.orders.update({_id: tr._id}, {$set:{"shipping.when": new Date(tr.shipping.when)}}))'
```

2) Install dependencies and run the server:
```
cd karibou-quad/server
npm install
node server.js
```
