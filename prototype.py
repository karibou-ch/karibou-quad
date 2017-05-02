import json
import csv


def vendors(transactions):
    vendors = []
    for t in transactions:
        for i in t['items']:
            vendors.append(i['vendor'])
    
    return list(set(vendors))

def stat_vendor(transactions, vendor):
    stat = []
    for t in transactions:
        for i in t['items']:
            if i['vendor'] == vendor:
                issue = 0
                if i['status'] != 'fulfilled' and i['status'] != 'issue_no_issue':
                    issue += 1

                stat.append( { 'transaction': 1, 'qty': i['qty'], 'price': i['price'], 'issue': issue, 'tx_issue': 1 if issue > 0 else 0  } )

    rep = {}
    rep['transaction'] = sum( [s['transaction'] for s in stat] )
    rep['amount'] = sum( [s['qty'] * s['price'] for s in stat] )
    qty = sum( [s['qty'] for s in stat] )
    rep['item_issue'] = sum( [s['issue'] for s in stat] )
    rep['tx_issue'] = sum( [s['tx_issue'] for s in stat] )
    rep['item_percent_issue'] = rep['item_issue'] / rep['transaction'] * 100
    rep['tx_percent_issue'] = rep['tx_issue'] / rep['transaction'] * 100
    rep['vendor'] = vendor

    if qty != 0:
        rep['mean_items'] = rep['amount'] / qty 
    else:
        rep['mean_items'] = 0

    return rep

with open('./tests/data/orders.json') as json_file:
    transactions = json.load(json_file)

    print("Vendors ", end="")
    print("*" * 100)
    stat = []
    for v in vendors(transactions):
        print(v)
        stat.append(stat_vendor(transactions, v))

    for s in reversed(sorted(stat, key=lambda s: s['item_percent_issue'])):
        print(s)

    #keys = stat[0].keys()
   # with open('items.csv', 'w') as output:
   #     dict_writer = csv.DictWriter(output, keys)
   #     dict_writer.writeheader()
   #     dict_writer.writerows(stat)

        
