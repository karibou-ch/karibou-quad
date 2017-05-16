import {Component, OnInit, Input} from '@angular/core';
import {DatabaseService} from "../../core/database.service";
import {ActivatedRoute, Router} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  private vendor: any;

  private name: string = "";
  private amount: number = 0;
  private nbItems: number = 0;
  private customers: number = 0;
  private nbTransactions: number = 0;
  private score: number = 0;
  private scoreRate: number = 0;
  private scoreTransactionsRate: number = 0;
  private issue_mp: number = 0;
  private issue_wpq_failure: number = 0;
  private issue_wpq_fulfilled: number = 0;
  private customerDetails: any[] = [];
  private impactedCustomers: number = 0;
  private impactedCustomersRate: number = 0;

  private allScoreRate: number = 0;
  private allAmount: number = 1;

  private issuesChart = [];
  private issuesTransactionsChart = [];
  private amountChart = [];
  private customersChart = [];
  private issuesTypeChart = [];

  constructor(private databaseService: DatabaseService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.init();
    });

  }

  private init(): void {

    this.issuesChart = [];
    this.issuesTransactionsChart = [];
    this.amountChart = [];
    this.customersChart = [];
    this.issuesTypeChart = [];


    this.databaseService.vendor(this.route.snapshot.params['id']).subscribe(
      vendor => {
        this.vendor = vendor;
        this.name = vendor._id;
        this.amount = Math.round(vendor.amount*100)/100;
        this.nbItems = vendor.nb_items;
        this.customers = vendor.customers;
        this.nbTransactions = vendor.nb_transactions;
        this.score = vendor.score;
        this.scoreRate = Math.round(vendor.score_rate*10)/10;
        this.scoreTransactionsRate= Math.round(vendor.score_transactions_rate*10)/10;
        this.issue_mp = vendor.issue_missing_product;
        this.issue_wpq_failure = vendor.issue_wrong_product_quality_failure;
        this.issue_wpq_fulfilled = vendor.issue_wrong_product_quality_fulfilled;
        this.customerDetails = _.chain(vendor.customers_details).forEach( v => { v.score_rate = Math.round(v.score_rate*10)/10}).sortBy('score_rate').reverse().value();
        this.impactedCustomers = _.chain(this.customerDetails).filter(d => d.score > 0).value().length;
        this.impactedCustomersRate = Math.round(this.impactedCustomers/this.customers*1000)/10;
      }
    );

    this.databaseService.vendors().subscribe(
      vendors => {

        vendors.forEach( v => v['impacted_customers'] = _.chain(v['customers_details']).filter(d => d.score > 0).value().length);

        this.allScoreRate = _.map(vendors, v => v.score_rate).reduce( (a,b) => a+b, 0 );
        this.allAmount = _.map(vendors, v => v.amount).reduce( (a,b) => a+b, 0 );
        this.issuesChart = [[this.name, 100/this.allScoreRate*this.scoreRate], ['autres', (100/this.allScoreRate*(this.allScoreRate-this.scoreRate))]];
        this.issuesChart = _
          .chain(vendors)
          .sortBy( v => v.score_rate )
          .reverse()
          .filter( v => v._id !== this.name)
          .take(4)
          .map( v => [v._id, v.score_rate])
          .value();
        this.issuesChart.push([this.name, this.scoreRate]) ;
        _.reverse(this.issuesChart);

        this.issuesTransactionsChart = _
          .chain(vendors)
          .sortBy( v => v.score_transactions_rate )
          .reverse()
          .filter( v => v._id !== this.name)
          .take(4)
          .map( v => [v._id, v.score_transactions_rate])
          .value();
        this.issuesTransactionsChart.push([this.name, this.scoreTransactionsRate]) ;
        _.reverse(this.issuesTransactionsChart);

        this.amountChart = _
          .chain(vendors)
          .sortBy( v => v.amount )
          .reverse()
          .filter( v => v._id !== this.name)
          .take(4)
          .map( v => [v._id, v.amount])
          .value();
        this.amountChart.push([this.name, this.amount]);
        _.reverse(this.amountChart);


        this.customersChart = _
          .chain(vendors)
          .sortBy( v => v.impacted_customers)
          .reverse()
          .filter( v => v._id !== this.name)
          .take(4)
          .map( v => [v._id, v.impacted_customers])
          .value();
        this.customersChart.push([this.name, this.impactedCustomersRate]);
        _.reverse(this.customersChart);

        this.issuesTypeChart = [
          ['Erreurs qualités (fulfilled)', this.issue_wpq_fulfilled],
          ['Erreurs qualités (failure)', this.issue_wpq_failure],
          ['Produits manquants', this.issue_mp]
        ];

      }
    );
  }


}
