# Caractérisation de la qualité d'un réseau alimentaire décentralisé (QAD)
> chèque d’innovation 2013-2016 - Conseils en recherche et en innovation pour PME

|![](https://www.kti.admin.ch/kti/fr/_jcr_content/logo/image.imagespooler.png/1433344096335/logo.png)   | ![](http://campus.hesge.ch/milano2015/img/logos/logohepia.png)  |
|---|---|


## Problème à résoudre

Jusqu’à présent la technologie utilisée dans la chaîne alimentaire a été principalement orientée vers
l’augmentation de la rentabilité par l’usage de plus de machines et plus de chimie. Aujourd’hui, la
principale révolution technologique s'axe autour de l’organisation de l’information et peut mener au
remplacement d’un modèle vertical (top-down) a un modèle latéral (bottom-up). Nous pensons que la
chaîne alimentaire n’est plus nécessairement tributaire d’une structure verticale pour organiser, valoriser
et distribuer son travail. Le petit commerce local peut se réinventer tout en conservant son autonomie,
mutualiser une logistique en flux tendu et offrir au consommateur des outils transparents pour (re)créer
les liens entre production et alimentation.
La start-up karibou.ch est née de ce constat, elle est organisée en un marketplace de e-commerce
alimentaire fonctionnant en peer to peer (P2P) qui met en relation les agriculteurs, artisans et boutiques
de commerce de proximité avec leurs clients. Selon le mode P2P, chaque boutique est autonome et
effectue la vente directement auprès de ses clients. Cette inversion de hiérarchie de la logistique
réinvente la distribution alimentaire en faisant diminuer drastiquement les coûts de la logistique.

**Dans ce contexte peer-to-peer (décentralisé) et sans contrôle central, la mesure de la qualité du
service et des produits est un élément crucial. C’est le premier enjeu de cette recherche.**


## Objectif
Comment déterminer une valeur objective à un produit, un commerçant, à la livraison ? Comment
détecter rapidement une variation de qualité ?  
Notre objectif est de trouver un ou N algorithmes qui pourront évaluer la qualité du réseau, d'un individu, d'un produit et d'une boutique

``` javascript
Required knowledge: machine learning, deep learning, computer science, nodejs, npm, mongodb
Difficulty level: intermediate
Mentors: Florent Gluck, Olivier Evalet
```

## Authors & spcial thanks :heart:

- Joel Cavat (https://github.com/jcavat)
- Olivier Evalet, https://github.com/evaletolab
- Florent Gluck @HEPIA, https://github.com/florentgluck
- Noria Foukia Enseignante en mathématiques @HEPIA 



## Task Idea
* [QUALITY.md](QUALITY.md)

## Expected results
* From an initial set of possible models and hypothesis, what is the most appropriate model to fit our data
* Based on our data, generate a subset of training data, postive prediction and negative prediction
* Implement a learing process that could be embeded in the karibou.ch project. For exemple, user place an order and the machine will learn what is relvant or not based on the prediction for the user.
* Create a a simple prototype that displays a prediction product list for a user. 
* Based on training data, it will be awesome to get clusters of customers (based on the distance between each)

## About the data
Orders *(size ~1200)* contains all information about user, products, time, etc. Here a small description:
``` javascript
{
    "oid": 2000002,
    "shipping": {
      "postalCode": "1205",
      "when": "2014-12-12T15:00:00.000Z",
      "bags": 2  /** Number of shipped bags for this order */
    },
    "customer": {
      "id": 2180215629900685,
      "pseudo": "f**i",
      "created": "2014-12-09T23:28:45.138Z"
      "likes":[] /** prefered SKU */
    },
    "vendors": [{
          "slug": "les-fromages-de-gaetan",
          "discount":2.90
        },
        ...
    ],
    "items": [
      {
        "title": "Mini chevrot",
        "sku": 1000020,
        "vendor": "les-fromages-de-gaetan",
        "image": "//uploadcare.com/uuid",
        "price": 4.9,
        "finalprice": 4.9, /** Diff between order estimation and captured amount*/
        "qty": 1,
        "category": "Produits laitiers"
        "issue": "issue_missing_product",
        "status": "failure"
      },
      ...
``` 
* un client aime des produits `order.cutomer.likes`
* un article d'une commande `items.status` à le statut `"failure", "fulfilled"`
* lors d'une annulation, il peut y avoir le problème `items.issue` suivant
  * `"issue_no_issue"` **== pas grâve/0** , 
  * `"issue_missing_product"` **== problématique/1**, 
  * `"issue_wrong_product_quality"` et `"items.status===failure"` **== très problématique/2**,
  * `"issue_wrong_product_quality"` et `"items.status===fulfilled"` **== létal/4**,
* `discount` is the amount the seller offer to the customer for this order



#### Basic requirements

- Be passionate, reactive and technically brilliant :-)
- Interested in food as a major paradigm to improve health, protect our environment and all the species with whom we share this planet
- Participate in regular meetings with your mentor.
- Deliver code before the deadline
- Get in contact with your mentors or the admins if any even remotely potential problems arise.

Experience and familiarity with most/all of these:

- nodejs, npm, mongodb,
- mocha for unit testing,
- Git, GitHub and submit pull request process,
- [Deeplearning](https://classroom.udacity.com/courses/ud730/lessons/6370362152/concepts/63703142310923) or Machine learning skills,
- Bash

#### Helpful extras

General understanding of any of these:

- TravisCI & continuous integration
- NPM packaging systems


# First iteration: May 2017
## Milestones
Project runs from 1st of May 2017 to 2nd of June 2017 approximately (~5 weeks to 40%)
- Information retrieval ~ 1 week
  - state of the art, analysis of existing systems, ... 
- Analysis of the problem ~ 1 week
  - analysing data structure, define useful input and output variables/attributes
- Implementation of a mapping function ~ 1 week
  - from existing data structure to generic matrix based structure
  - readable from [Weka](http://www.cs.waikato.ac.nz/ml/weka/)
- Use machine learning algorithms with Weka ~ min 2 weeks
  - define rules
  - define score

## Documentation
A [wiki](https://github.com/karibou-ch/karibou-quad/wiki) is provide for more details.

## Prototype
A prototype is developed to illustrate statistics from JSON data with JS ecosystem technologies:
* MongoDB 3.4 to import JSON and exploit the power of aggragation queries (See [Development documentation](https://github.com/karibou-ch/karibou-quad/wiki/Developpement)).
* API Rest with node and express to extract mapped data (See [API documentation](https://github.com/karibou-ch/karibou-quad/wiki/API-Documentation)).
* Angular 4 and Chart.js to plots statistics (See [Development documentation](https://github.com/karibou-ch/karibou-quad/wiki/Developpement)).

These technologies are closed to those used by production current solution.

## Dependencies to run the project
* npm and node ([Installation of Node on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-16-04))
* angular cli [Angular CLI](https://github.com/angular/angular-cli)
* docker ([Installation of docker on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-docker-on-ubuntu-16-04))
* docker-compose ([Installing Docker Compose on Ubuntu 16.04](https://www.digitalocean.com/community/tutorials/how-to-install-docker-compose-on-ubuntu-16-04))

## Run all the project
##### Simulate the mongodb 3.4 database in a Docker container ([more details here](https://github.com/karibou-ch/karibou-quad/tree/master/test))
The build import the JSON into the MongoDB database and update dates in a string format to ISODate format. In the
`test` folder, run:
```
cd karibou-quad/test
docker-compose build 
docker-compose up -d
```

##### Start Rest API ([more details here](https://github.com/karibou-ch/karibou-quad/tree/master/server))
Start the Rest API for the statistics requests. In the `server` folder, run:
```
cd karibou-quad/server
npm install
node server.js
```

##### Start the dashboard  ([more details here](https://github.com/karibou-ch/karibou-quad/tree/master/client))
Start the client dashboard. In the `client` folder, run:
```
cd karibou-quad/client
npm install
ng serve
```

Watch the stats on localhost:4200. Enjoy!
See the [wiki](https://github.com/karibou-ch/karibou-quad/wiki) for more documentation.



