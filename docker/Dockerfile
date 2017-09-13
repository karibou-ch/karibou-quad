FROM mongo
COPY ./data/orders.json /orders.json
CMD mongoimport --host mongo-karibou --db order --collection orders --type json --file orders.json --jsonArray && mongo --host mongo-karibou order --eval 'db.orders.find( { "customer.id.floatApprox": { $exists: true } } ).forEach( tr => db.orders.update({_id: tr._id},{$set:{"customer.id": tr.customer.id.floatApprox}}  ) )' && mongo --host mongo-karibou order --eval 'db.orders.find().forEach( tr => db.orders.update({_id: tr._id}, {$set:{"shipping.when": new Date(tr.shipping.when)}}))'
