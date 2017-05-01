## Elements 
* Déterminer le niveau du problème `order.items.$.fulfillment.issue`
  * `"issue_no_issue"` **== pas grâve/0** , 
  * `"issue_missing_product"` **== problématique/1**, 
  * `"issue_wrong_product_quality"` et `"items.status===failure"` **== très problématique/2**,
  * `"issue_wrong_product_quality"` et `"items.status===fulfilled"` **== létal/4**,
* Déterminer si une boutique surfacture les produits
  * `DIFF%(order.items.$.finalprice,order.items.$.price)`
* Déterminer le risque d’une boutique de compromettre le marketplace
  * `order.created` 
  * `order.items.$.fulfillment.issue!=='issue_no_issue'`, 
  * `order.items.$.fulfillment.status==='failed'`
  * `order.oid` vérifier si pour la même commande il y a plusieurs erreurs, de la même boutique
* Évaluer la disponibilité d’un produit dans l'année.
  * `month(order.created)`
  * `order.items.$.sku`
  * `order.items.$.vendor`
* Évaluer l’intérêt d’un produit (nb commandes par utilisateur unique vs tous).
  * `count(order.items.$.sku)` 
  * `order.customer.id` 
* Évaluer le service d’une boutique (nb commandes, validation, issue).
  * `order.items.$.fulfillment.issue`, 
  * `order.items.$.fulfillment.status==='failed'`
  * `order.oid` 
  * `order.created` 
* Évaluer les très grâves erreurs d’une boutique (nb commandes, validation, issue).
  * `order.items.$.fulfillment.issue==='issue_wrong_product_quality'`, 
  * `order.items.$.fulfillment.status==='fulfilled'`
* Évaluer le client (fréquence de commandes 'mois,trimestre,semestre,...' , montant des commandes,
  * `order.oid` 
  * `order.customer.id`
  * `order.items.$.fulfillment.issue!=='issue_no_issue'` ET `order.items.$.vendor`, 
  * `sum(order.items.$.finalprice)` ET `fulfilled` 
  * `order.customer.likes`


## TODO (on a pas encore les datas)
* Évaluer la qualité d’un hub logistique (timing de la collecte, validation, qualité * des sacs (trop de plastique, oeufs cassés, tomates écrasées…) en fonction des * retours clients, timing de la préparation des sacs (données à ajouter).
  * `order.created` 
  * `order.vendors.$.collected`
  * missing date `order.vendors.$.collectedTime`
  * missing date `order.items.$.updated`
  * missing feedback `order.items.$.feedback{customer, date, rating, note}`
* Évaluer le travail du livreur (timing livraison, retours clients)
  * `order.created` 
  * `order.shipping.shipped`
  * missing date `order.shipping.shipped_done`
  * missing email `order.shipping.shipped_by`
  * `order.shipping.bags`
* Évaluer la qualité d’un(e) produit/boutique en fonction des retours clients * (fraîcheur, goût, état, poids correct, erreur de produit).
  * missing !!
* Évaluer la fraîcheur, la qualité et le rapport qualité/prix d’un produit en * fonction des retours clients.
  * missing !!
* produits achetés, réclamations/doléances, félicitations). .
  * missing

