import json
import csv
from itertools import *
from functools import *


def vendors_list(transactions):
    vendors = []
    for t in transactions:
        for i in t['items']:
            vendors.append(i['vendor'])

    return list(set(vendors))

def customers_list(transactions):
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
            items = t['items']
            for item in items:
                item['date'] = t['shipping']['when']
            stat.append(items)

    amount = 0
    nb_item = 0
    issue = []
    items = []
    for item in reduce( lambda x, y: x+y, stat ):
        amount += item['finalprice']
        nb_item += 1

        if 'issue' in item.keys() and item['issue'] != 'issue_no_issue':
            issue.append( { item['vendor']: item['issue'] })
        elif item['status'] == 'failure':
            issue.append( { item['vendor']: 'failure' })

        items.append(item)
        #print(item)

    rep = {}
    rep['nb_transactions'] = len(stat)
    rep['nb_issue'] = len(issue)
    rep['amount'] = amount
    rep['mean_amount'] = amount / rep['nb_transactions']
    rep['issue'] = issue
    rep['item_percent_issue'] = rep['nb_issue'] / nb_item * 100

    rep['matrix'] = groupby(sorted(items, key=lambda i: i['vendor']), key=lambda i: i['vendor'])

    return rep

def stat_vendor(transactions, vendor):
    stat = []
    for t in transactions:
        for i in t['items']:
            if i['vendor'] == vendor:
                issue = 0
                if is_problematic(i):
                    issue += 1

                stat.append( { 'nb_transaction': 1, 'qty': i['qty'], 'price': i['price'], 'finalprice': i['finalprice'], 'nb_issue': issue, 'transaction_issue': 1 if issue > 0 else 0  } )

    rep = {}
    rep['nb_transaction'] = sum( [s['nb_transaction'] for s in stat] )
    rep['amount'] = sum( [s['finalprice'] for s in stat] )
    qty = sum( [s['qty'] for s in stat] )
    rep['qty'] = qty
    rep['nb_item_issue'] = sum( [s['nb_issue'] for s in stat] )
    rep['nb_transaction_issue'] = sum( [s['transaction_issue'] for s in stat] )
    rep['item_percent_issue'] = rep['nb_item_issue'] / rep['nb_transaction'] * 100
    rep['transactions_percent_issue'] = rep['nb_transaction_issue'] / rep['nb_transaction'] * 100
    rep['qty_percent_issue'] = rep['nb_transaction_issue'] / qty * 100
    rep['vendor'] = vendor

    if qty != 0:
        rep['mean_items'] = rep['amount'] / qty
    else:
        rep['mean_items'] = 0

    return rep


def show_customers_stat(transactions):
    exports_sc = []
    exports_cust = []
    for c in customers_list(transactions):
        print("*" * 100)
        print(c)
        stat = stat_customer(transactions, c)
        for k, v in stat.items():
            if k != 'matrix':
                print("\t {0: <30}".format(k, ": "), v)

        print("\t", "*" * 50)
        total_issue = 0
        total_amount = 0
        total_transaction = 0
        for k, items in stat['matrix']:
            print("\t", k)
            amount = 0
            nb_transactions = 0
            nb_issues = 0
            for item in items:
                nb_transactions += 1
                amount += item['finalprice']
                nb_issues += 1 if is_problematic(item) else 0

            exports_sc.append( {'customer': c, 'vendors': k, 'nb_transactions': nb_transactions, 'amount': amount, 'nb_issues': nb_issues, 'percent_issue': nb_issues/nb_transactions*100 } )

            total_issue += nb_issues
            total_amount += amount
            total_transaction += nb_transactions


            print("\t\tamout: ", amount)
            print("\t\tnb_transactions: ", nb_transactions)
            print("\t\tnb_issues: ", nb_issues)



        exports_cust.append( {'customer': c, 'nb_issues': total_issue, 'nb_transactions': total_transaction, 'amount': total_amount, 'percent_issue': total_issue/total_transaction*100 } )

    keys = exports_sc[0].keys()
    with open('customers_vendors.csv', 'w') as output:
        dict_writer = csv.DictWriter(output, keys)
        dict_writer.writeheader()
        dict_writer.writerows(exports_sc)

    keys = exports_cust[0].keys()
    with open('customers.csv', 'w') as output:
        dict_writer = csv.DictWriter(output, keys)
        dict_writer.writeheader()
        dict_writer.writerows(exports_cust)

def show_vendors_stat(transactions):
    stat = []
    for v in vendors_list(transactions):
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


    keys = stat[0].keys()
    with open('vendors.csv', 'w') as output:
        dict_writer = csv.DictWriter(output, keys)
        dict_writer.writeheader()
        dict_writer.writerows(reversed(sorted(stat, key=lambda s: s['transactions_percent_issue'])))


with open('./tests/data/orders.json') as json_file:
    transactions = json.load(json_file)


    show_vendors_stat(transactions)

    for _ in range(4):
        print("*" * 100)

    show_customers_stat(transactions)
