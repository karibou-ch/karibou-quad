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


## Task Idea
* un produit souvent acheté gagne du poids (la valeur individuelle vs la valeur globale)
* un produit souvent upvoté gagne du poids
* un upvote a moins de poids qu'un achat récurrent
* le calcul du poids est une fonction du temps
* une boutique hérite du poids de ses produits
* une boutique perd du poids lorsqu'elle annule un article commandé par un client
* une boutique perd du poids lorsqu'un article est manquant à la commande (implique un retour client)
* une boutique perd du poids lorsqu'un article est mal emballé (implique un retour client)
* une boutique perd du poids lorsqu'un article est de mauvaise qualité (implique un retour client)
* la réputation peut donner lieu à des sanctions ou des récompenses (important)
* un client gagne en réputation lorsqu'il passe souvent des commandes
* un client gagne en réputation lorsqu'il évalue la commande
* un client peut se tromper sur l'évaluation d'un produit (comment prendre en compte les faux négatifs)
* une commande est de meilleur qualité dans certaines circonstances (exemple, en hiver c'est plus facile)

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
        "qty": 1,
        "category": "Produits laitiers"
        "issue": "issue_missing_product",
        "status": "failure"
      },
      ...
``` 
* `items.status` is one of `"failure", "fulfilled"`
* `items.issue` is one of `"issue_missing_client_id", "issue_missing_product", "issue_missing_validation", "issue_missing_customer_support", "issue_wrong_packing", "issue_wrong_product", "issue_wrong_client_id", "issue_wrong_product_quality", "issue_late_delivry"`
* `discount` is the amount the seller offer to the customer for this order

# Advice for Students

If you are a student and interested in working on karibou.ch project as part of GSoC then please read the information below, as well as the GSoC program information provided by Google, including the [student manual](https://developers.google.com/open-source/gsoc/resources/manual) and [timeline](https://developers.google.com/open-source/gsoc/timeline). 

* I found a great project! Contact us, we are active on [gitter](https://gitter.im/karibou-ch/). Just drop by and leave us a message!
* I have an own project idea!  Superb! We recommend you submit your idea as a [GitHub Issues](https://github.com/karibou-ch/karibou-ml-userx/issues).

## Guidelines & requirements
Potential candidates should to take a look at [GitHub Issues](https://github.com/karibou-ch/karibou-ml-userx/issues). It can help you get some idea how things would work during the GSoC.

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


# Milestones
project runs from 1st of May 2017 to 2nd of June 2017 approximately (~5 weeks)
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
