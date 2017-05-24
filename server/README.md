# Summary
This REST Api Server is used to map the data. Routes are provided for clients to show statistics on a dashboard. If you would use another mapping technic, please keep the same routes name and the same response structure.

## Prequisite
 * [Installation of docker](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04)
 * [Installing Docker Compose](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04)

## Install guide
Install dependencies:
```
npm install
```

Simulate the mongodb 3.4 database and import data from JSON:
```
cd ../test
docker-compose build
docker-compose up -d
```

Run the server:
```
node server.js
```
