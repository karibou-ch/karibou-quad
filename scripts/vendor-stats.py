import json
import csv
from functools import *
from itertools import *
from sklearn import linear_model
from dateutil.parser import parse
import datetime
import matplotlib.pyplot as plt
import numpy as np
import os
import math


plt.rcParams.update({'font.size': 5})

def is_problematic(item):
    return ('issue' in item.keys() and 'name' in item['issue'].keys()) #or item['status'] == 'failure'

def is_letal(item):
    return ('issue' in item.keys() and 'name' in item['issue'].keys()) and item['status'] == 'fulfilled'


def export_to_csv(dictionnary, filename):
    keys = dictionnary[0].keys()
    with open(filename, 'w') as output:
        dict_writer = csv.DictWriter(output, keys)
        dict_writer.writeheader()
        dict_writer.writerows(dictionnary)

with open('../test/data/orders.json') as json_file:

    # Prepare and transform transacions/items -------------------------------------------------------------------------------
    transactions = json.load(json_file)

    def add_transaction_info_on_item(item, transaction):        
        customer = transaction['customer']
        customer = int(customer['id']['$numberLong']) if isinstance(customer['id'], dict) else int(customer['id'])
        oid = transaction['oid']
        item.update({ 'customer': customer })
        item.update({ 'id_transaction': oid })
        item.update({ 'date': transaction['shipping']['when']['$date'] })
        return item

    for t in transactions:
        t['items'] = [ add_transaction_info_on_item(i, t) for i in t['items'] ]

    # Transactions details -------------------------------------------------------------------------------
    items = [ t['items'] for t in transactions]    

    def map_transaction(transaction):
        def map_item(item):
            date = parse(item['date'])
            # Details structure to export:
            return { 
                'finalprice': item['finalprice'],
                'vendor': item['vendor'],
                'customer': item['customer'],
                'is_problematic': 1 if is_problematic(item) else 0,
                'is_letal': 1 if is_letal(item) else 0,
                'missing': 1 if item['status'] == 'failure' or ('issue' in item.keys() and item['issue'] == 'issue_missing_product') else 0,
                'qlty': 1 if 'issue' in item.keys() and item['issue'] == 'issue_wrong_product_quality' else 0,
                'id_transaction': item['id_transaction'],
                'price_diff': item['finalprice'] - item['estimatedprice'],
                'price_diff_rate': (item['finalprice'] - item['estimatedprice'])/item['estimatedprice']*100 if item['estimatedprice'] != 0 else 0,
                'date': "{}.{}.{}".format(date.day, date.month, date.year)
            }

        mapped_items = [ map_item(item) for item in transaction ]
        return mapped_items

    mapped_items = [ map_transaction(i) for i in items ]
    mapped_items = reduce( lambda x, y: x+y, mapped_items )

    export_to_csv(mapped_items, 'transactions.csv')
    


    # Vendors vs Customer details -------------------------------------------------------------------------------
    vendors_customers_details = []
    c = []
    v = []
    mp = {}

    for customer, items in groupby(sorted(mapped_items, key=lambda mi: mi['customer']), key=lambda mi: mi['customer']):
        c.append(customer)
        if customer not in mp.keys():
            mp[customer] = {}
        for vendor, items in groupby(sorted(items, key=lambda mi: mi['vendor']), key=lambda mi: mi['vendor']):
            v.append(vendor)

            items = list(items)
            nb_issues = sum([ mi['is_problematic'] for mi in items ])
            nb_transactions = len(list(items))
            amount = sum([ mi['finalprice'] for mi in items ])
            price_diff = sum([ mi['price_diff'] for mi in items ])

            # Details structure to export:
            record = {
                'vendor': vendor,
                'customer': customer,
                'nb_issues': nb_issues,
                'nb_transactions': nb_transactions,
                'amount': amount,
                'price_diff': price_diff,
                'issues_rate': nb_issues/nb_transactions*100
            } 
            vendors_customers_details.append( record )
            mp[customer][vendor] = record
        
    c = list(set(c))
    v = list(set(v))
    x = []
    y = []
    area = []
    color = []
    i = 0
    j = 0
    for i, customer in enumerate(c):
        for j, vendor in enumerate(v):
            x.append(i)
            y.append(j)
            if vendor in mp[customer].keys():
                area.append(mp[customer][vendor]['amount']**(0.8))
                color.append(min(250, int(mp[customer][vendor]['issues_rate']*5+100)) if mp[customer][vendor]['issues_rate'] > 0 else 0)
            else:
                area.append(0)
                color.append(0)

    plt.scatter(x, y, s=area, c=color, alpha=0.5)
    plt.savefig('vendor-constomer.png')


    export_to_csv(vendors_customers_details, 'vendors_customers.csv')



    # Vendors details ----------------------------------------------------------------------------------------------------
    vendors_details = []
    for k, items in groupby(sorted(mapped_items, key=lambda mi: mi['vendor']), key=lambda mi: mi['vendor']):
        items = list(items)

        nb_issues = sum([ mi['is_problematic'] for mi in items ])
        nb_transactions = len(list(items))
        amount = sum([ mi['finalprice'] for mi in items ])
        nb_customers = len( set( [ mi['customer'] for mi in items ] ))
        price_diff = sum([ mi['price_diff'] for mi in items ])

        # Details structure to export:
        vendors_details.append( { 
            'vendor': k,
            'nb_issues': nb_issues,
            'nb_transactions': nb_transactions,
            'amount': amount,
            'nb_customers': nb_customers,
            'price_diff': price_diff,
            'issues_rate': nb_issues/nb_transactions*100
        } )

    export_to_csv(vendors_details, 'vendors.csv')


    # customers details ----------------------------------------------------------------------------------------------------
    customers_details = []
    for k, items in groupby(sorted(mapped_items, key=lambda mi: mi['customer']), key=lambda mi: mi['customer']):
        items = list(items)

        nb_issues = sum([ mi['is_problematic'] for mi in items ])
        nb_transactions = len(list(items))
        amount = sum([ mi['finalprice'] for mi in items ])
        nb_vendors = len( set( [ mi['vendor'] for mi in items ] ))
        price_diff = sum([ mi['price_diff'] for mi in items ])

        # Details structure to export:
        customers_details.append( { 
            'customer': k,
            'nb_issues': nb_issues,
            'nb_transactions': nb_transactions,
            'amount': amount,
            'nb_vendors': nb_vendors,
            'price_diff': price_diff,
            'issues_rate': nb_issues/nb_transactions*100
        } )

    export_to_csv(customers_details, 'customers.csv')



    # Vendors vs Time details ----------------------------------------------------------------------------------------------------
    vendors_time_details = []
    for vendor, items in groupby(sorted(mapped_items, key=lambda mi: mi['vendor']), key=lambda mi: mi['vendor']):
        items = list(items)
        # transform str_date to date
        for i in items:
            i['date'] = datetime.datetime.strptime(i['date'], '%d.%m.%Y').date()

        acc = []
        axis = []
        # group by year
        for year, items in groupby(sorted(items, key=lambda mi: mi['date']), key=lambda mi: mi['date'].year):
            items = list(items)
            for month, items in groupby(sorted(items, key=lambda mi: mi['date']), key=lambda mi: mi['date'].month):
                items = list(items)

                nb_issues = sum([ mi['is_problematic'] for mi in items ])
                nb_letal = sum([ mi['is_letal'] for mi in items ])
                nb_transactions = len(list(items))
                amount = sum([ mi['finalprice'] for mi in items ])
                price_diff = sum([ mi['price_diff_rate'] for mi in items ])// float(len(list(items)))
                nb_vendors = len( set( [ mi['vendor'] for mi in items ] )) # ?
                nb_customers = len( set( [ mi['customer'] for mi in items ] ))

                acc.append( (nb_transactions, float(nb_letal)/float(nb_transactions)*100.0, nb_customers, amount, float(nb_issues)/float(nb_transactions)*100.0, price_diff) )
                axis.append('1.' + str(month) + '.' + str(year))


        plt.suptitle(vendor, fontsize=8)

        def movingaverage (values, window):
            weights = np.repeat(1.0, window)/window
            sma = np.convolve(values, weights, 'valid')
            return sma

        txt = ["ventes", "erreurs graves %", "clients uniques", "montant CHF", "taux erreurs %", "difference prix %"]
        for i, t in enumerate(txt):

            ax = plt.subplot(2,3,i+1)
            plt.xticks(rotation=70)
            #plt.xticks(range(len(axis)), axis)
            plt.xticks(np.arange(0,32, 2.0), axis[::2])
            ax.plot(list(zip(*acc))[i])

            x_lin = np.array(range(len(axis))).reshape(-1, 1)
            regr = linear_model.LinearRegression()
            regr.fit(x_lin, list(zip(*acc))[i])
            ax.plot(regr.predict(x_lin), color='red')

            #ax.plot(movingaverage(list(zip(*acc))[i], 3 if len(acc) < 16 else 6), color='red')

            ax.set_title(t, fontsize=5)
            plt.sca(ax)
            


        plt.tight_layout(rect=[0, 0.03, 1, 0.95])
        #plt.show()
        vendors_directory = 'vendors_stat'
        if not os.path.exists(vendors_directory):
            os.makedirs(vendors_directory)
        plt.savefig('./' + vendors_directory + '/' + vendor + '.png',dpi=150)
        plt.clf()
        plt.close()




