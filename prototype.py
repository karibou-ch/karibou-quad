import json
import csv
from itertools import *
from functools import *


def vendors(transactions):
    vendors = []
    for t in transactions:
        for i in t['items']:
            vendors.append(i['vendor'])
    
    return list(set(vendors))

def customers(transactions):
    customers = []
    for t in transactions:
        if isinstance(t['customer']['id'], dict):
            customers.append(t['customer']['id']['floatApprox'])
        else:
            customers.append(t['customer']['id'])
    
    return list(set(customers))

def is_problematic(item):
    return ('issue' in item.keys() and item['issue'] != 'issue_no_issue') or item['status'] == 'failure'


def issues_details(transactions, vendor):
    stat = []
    for t in transactions:
        for i in t['items']:
            if i['vendor'] == vendor:
                if 'issue' in i.keys() and i['issue'] != 'issue_no_issue':
                    stat.append(i['issue'])
                elif i['status'] == 'failure':
                    stat.append('failure')
    return stat


def stat_customer(transactions, customer_id):
    stat = []
    for t in transactions:
        if isinstance(t['customer']['id'], dict) and t['customer']['id']['floatApprox'] == customer_id or \
            t['customer']['id'] == customer_id:
            stat.append(t['items'])

    amount = 0
    issue = []
    for item in reduce( lambda x, y: x+y, stat ):
        amount += item['qty'] * item['price']

        if 'issue' in item.keys() and item['issue'] != 'issue_no_issue':
            issue.append( { item['vendor']: item['issue'] })
        elif item['status'] == 'failure':
            issue.append( { item['vendor']: 'failure' })

        print(item)

    rep = {}
    rep['nb_transactions'] = len(stat)
    rep['amount'] = amount
    rep['issue'] = issue

    return rep

def stat_vendor(transactions, vendor):
    stat = []
    for t in transactions:
        for i in t['items']:
            if i['vendor'] == vendor:
                issue = 0
                if is_problematic(i):
                    issue += 1

                stat.append( { 'nb_transaction': 1, 'qty': i['qty'], 'price': i['price'], 'nb_issue': issue, 'transaction_issue': 1 if issue > 0 else 0  } )

    rep = {}
    rep['nb_transaction'] = sum( [s['nb_transaction'] for s in stat] )
    rep['amount'] = sum( [s['qty'] * s['price'] for s in stat] )
    qty = sum( [s['qty'] for s in stat] )
    rep['nb_item_issue'] = sum( [s['nb_issue'] for s in stat] )
    rep['nb_transaction_issue'] = sum( [s['transaction_issue'] for s in stat] )
    rep['item_percent_issue'] = rep['nb_item_issue'] / rep['nb_transaction'] * 100
    rep['tx_percent_issue'] = rep['nb_transaction_issue'] / rep['nb_transaction'] * 100
    rep['vendor'] = vendor

    if qty != 0:
        rep['mean_items'] = rep['amount'] / qty 
    else:
        rep['mean_items'] = 0

    return rep


def show_customers_stat(transactions):
    for c in customers(transactions):
        print("*" * 100)
        print(c)
        stat = stat_customer(transactions, c)
        for k, v in stat.items():
            print("\t {0: <30}".format(k, ": "), v)


def show_vendors_stat(transactions):
    stat = []
    for v in vendors(transactions):
        stat.append(stat_vendor(transactions, v))


    for s in reversed(sorted(stat, key=lambda s: s['item_percent_issue'])):
        print("*" * 100)
        print(s['vendor'])
        for k, v in s.items():
            if k != 'vendor':
                print("\t {0: <30}".format(k), "{0: <20}".format(v))

        if len(issues_details(transactions, s['vendor'])) > 0:
            print("\t", "*" * 50)
            for k, value in groupby(sorted(issues_details(transactions, s['vendor']))):
                print("\t", k, len(list(value)))
            print("\t", "*" * 50)


    #keys = stat[0].keys()
   # with open('items.csv', 'w') as output:
   #     dict_writer = csv.DictWriter(output, keys)
   #     dict_writer.writeheader()
   #     dict_writer.writerows(stat)


with open('./tests/data/orders.json') as json_file:
    transactions = json.load(json_file)


    show_vendors_stat(transactions)

    for _ in range(4):
        print("*" * 100)

    show_customers_stat(transactions)


        
