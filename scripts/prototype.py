import json
import csv
from functools import *
from itertools import *
from dateutil.parser import parse
import datetime
import matplotlib.pyplot as plt



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
        item.update({ 'date': transaction['shipping']['when'] })
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
                'id_transaction': item['id_transaction'],
                'price_diff': item['finalprice'] - item['price'],
                'price_diff_rate': (item['finalprice'] - item['price'])/item['price']*100 if item['price'] != 0 else 0,
                'date': "{}.{}.{}".format(date.day, date.month, date.year)
            }

        mapped_items = [ map_item(item) for item in transaction ]
        return mapped_items

    mapped_items = [ map_transaction(i) for i in items ]
    mapped_items = reduce( lambda x, y: x+y, mapped_items )

    export_to_csv(mapped_items, 'transactions.csv')
    


    # Vendors vs Customer details -------------------------------------------------------------------------------
    vendors_customers_details = []
    for customer, items in groupby(sorted(mapped_items, key=lambda mi: mi['customer']), key=lambda mi: mi['customer']):
        for vendor, items in groupby(sorted(items, key=lambda mi: mi['vendor']), key=lambda mi: mi['vendor']):

            items = list(items)
            nb_issues = sum([ mi['is_problematic'] for mi in items ])
            nb_transactions = len(list(items))
            amount = sum([ mi['finalprice'] for mi in items ])
            price_diff = sum([ mi['price_diff'] for mi in items ])

            # Details structure to export:
            vendors_customers_details.append( {
                'vendor': vendor,
                'customer': customer,
                'nb_issues': nb_issues,
                'nb_transactions': nb_transactions,
                'amount': amount,
                'price_diff': price_diff,
                'issues_rate': nb_issues/nb_transactions*100
            } )
        
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
                nb_transactions = len(list(items))
                amount = sum([ mi['finalprice'] for mi in items ])
                price_diff = sum([ mi['price_diff'] for mi in items ])
                nb_vendors = len( set( [ mi['vendor'] for mi in items ] )) # ?
                nb_customers = len( set( [ mi['customer'] for mi in items ] ))

                acc.append( (nb_transactions, nb_issues, nb_customers, amount) )
                axis.append('1.' + str(month) + '.' + str(year))

                #print("\t", '1.' + str(month) + '.' + str(year), (nb_issues, nb_transactions, amount, price_diff, nb_vendors, nb_customers, nb_issues/nb_transactions*100))

        plt.suptitle(vendor)


        txt = ["transactions", "issues", "consommateurs", "montant"]
        for i, t in enumerate(txt):
            ax = plt.subplot(2,2,i+1)
            plt.xticks(rotation=70)
            plt.xticks(range(len(axis)), axis)
            ax.plot(list(zip(*acc))[i])
            ax.set_title(t)
            plt.sca(ax)
            plt.xticks(rotation=70)
            plt.xticks(range(len(axis)), axis)







    
        #ax2 = ax1.twinx(2,1,2)
        #ax2.set_ylim([0,max(plot)/4])
        #ax2.plot(acc2, color='r')
        #ax2.tick_params('y', colors='r')

        plt.tight_layout()
        plt.savefig('./out/' + vendor + '.png')
        plt.clf()
        plt.close()


    #export_to_csv(vendors_time_details, 'vendors_time.csv')


