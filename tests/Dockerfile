FROM mongo
COPY ./data/orders.json /orders.json
CMD mongoimport --host mongo-karibou --db order --collection orders --type json --file orders.json --jsonArray
