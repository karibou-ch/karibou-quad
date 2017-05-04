import json
import csv
from functools import *
from itertools import *

def is_problematic(item):
    return ('issue' in item.keys() and item['issue'] != 'issue_no_issue') or item['status'] == 'failure'

def export_to_csv(dictionnary, filename):
    keys = dictionnary[0].keys()
    with open(filename, 'w') as output:
        dict_writer = csv.DictWriter(output, keys)
        dict_writer.writeheader()
        dict_writer.writerows(dictionnary)

with open('../tests/data/orders.json') as json_file:

    # Prepare and transform transacions/items -------------------------------------------------------------------------------
    transactions = json.load(json_file)

    def add_transaction_info_on_item(item, transaction):        
        customer = transaction['customer']
        customer = customer['id']['floatApprox'] if isinstance(customer['id'], dict) else customer['id']
        oid = transaction['oid']
        item.update({ 'customer': customer })
        item.update({ 'id_transaction': oid })
        return item

    for t in transactions:
        t['items'] = [ add_transaction_info_on_item(i, t) for i in t['items'] ]

    # Transactions details -------------------------------------------------------------------------------
    items = [ t['items'] for t in transactions]    

    def map_transaction(transaction):
        def map_item(item):

            # Details structure to export:
            return { 
                'finalprice': item['finalprice'],
                'vendor': item['vendor'],
                'customer': item['customer'],
                'is_problematic': 1 if is_problematic(item) else 0,
                'id_transaction': item['id_transaction'],
                'price_diff': item['finalprice'] - item['price']
            }

        mapped_items = [ map_item(item) for item in transaction ]
        return mapped_items

    mapped_items = [ map_transaction(i) for i in items ]
    mapped_items = reduce( lambda x, y: x+y, mapped_items )

    export_to_csv(mapped_items, 'transactions.csv')
    


    # Vendors vs Customer details -------------------------------------------------------------------------------
    vendors_customers_details = []
    for customer, mis in groupby(sorted(mapped_items, key=lambda mi: mi['customer']), key=lambda mi: mi['customer']):
        for vendor, mis in groupby(sorted(mis, key=lambda mi: mi['vendor']), key=lambda mi: mi['vendor']):

            mis = list(mis)
            nb_issues = sum([ mi['is_problematic'] for mi in mis ])
            nb_transactions = len(list(mis))
            amount = sum([ mi['finalprice'] for mi in mis ])
            price_diff = sum([ mi['price_diff'] for mi in mis ])

            # Details structure to export:
            vendors_customers_details.append( {
                'vendor': vendor,
                'customer': customer,
                'nb_issues': nb_issues,
                'nb_transactions': nb_transactions,
                'amount': amount,
                'price_diff': price_diff 
            } )
        
    export_to_csv(vendors_customers_details, 'vendors_customers.csv')



    # Vendors details ----------------------------------------------------------------------------------------------------
    vendors_details = []
    for k, mis in groupby(sorted(mapped_items, key=lambda mi: mi['vendor']), key=lambda mi: mi['vendor']):
        mis = list(mis)

        nb_issues = sum([ mi['is_problematic'] for mi in mis ])
        nb_transactions = len(list(mis))
        amount = sum([ mi['finalprice'] for mi in mis ])
        nb_customers = len( set( [ mi['customer'] for mi in mis ] ))
        price_diff = sum([ mi['price_diff'] for mi in mis ])

        # Details structure to export:
        vendors_details.append( { 
            'vendor': k,
            'nb_issues': nb_issues,
            'nb_transactions': nb_transactions,
            'amount': amount,
            'nb_customers': nb_customers,
            'price_diff': price_diff
        } )

    export_to_csv(vendors_details, 'vendors.csv')


    # customers details ----------------------------------------------------------------------------------------------------
    customers_details = []
    for k, mis in groupby(sorted(mapped_items, key=lambda mi: mi['customer']), key=lambda mi: mi['customer']):
        mis = list(mis)

        nb_issues = sum([ mi['is_problematic'] for mi in mis ])
        nb_transactions = len(list(mis))
        amount = sum([ mi['finalprice'] for mi in mis ])
        nb_vendors = len( set( [ mi['vendor'] for mi in mis ] ))
        price_diff = sum([ mi['price_diff'] for mi in mis ])

        # Details structure to export:
        customers_details.append( { 
            'customer': k,
            'nb_issues': nb_issues,
            'nb_transactions': nb_transactions,
            'amount': amount,
            'nb_vendors': nb_vendors,
            'price_diff': price_diff
        } )

    export_to_csv(customers_details, 'customers.csv')





