import {Component, OnInit, Input} from '@angular/core';
import {DatabaseService} from "../../core/database.service";
import {ActivatedRoute} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-vendor',
  templateUrl: './vendor.component.html',
  styleUrls: ['./vendor.component.css']
})
export class VendorComponent implements OnInit {

  private name: string = "";
  private amount: number = 0;
  private nbItems: number = 0;
  private customers: number = 0;
  private score: number = 0;
  private scoreRate: number = 0;
  private issue_mp: number = 0;
  private issue_wpq_failure: number = 0;
  private issue_wpq_fulfilled: number = 0;
  private details: any[] = [];

  private allScoreRate: number = 0;
  private allAmount: number = 1;

  private issuesChart = [];
  private amountChart = [];

  constructor(private databaseService: DatabaseService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.databaseService.vendor(this.route.snapshot.params['id']).subscribe(
      vendor => {
        this.name = vendor._id;
        this.amount = vendor.amount;
        this.nbItems = vendor.nb_items;
        this.customers = vendor.customers;
        this.score = vendor.score;
        this.scoreRate = Math.round(vendor.score_rate*10)/10;
        this.issue_mp = vendor.issue_missing_product;
        this.issue_wpq_failure = vendor.issue_wrong_product_quality_failure;
        this.issue_wpq_fulfilled = vendor.issue_wrong_product_quality_fulfilled;
        this.details = _.chain(vendor.customers_details).forEach( v => { v.score_rate = Math.round(v.score_rate*10)/10}).sortBy('score_rate').reverse().value();
      }
    );

    this.databaseService.vendors().subscribe(
      vendors => {
        this.allScoreRate = _.map(vendors, v => v.score_rate).reduce( (a,b) => a+b, 0 );
        this.allAmount = _.map(vendors, v => v.amount).reduce( (a,b) => a+b, 0 );
        this.issuesChart = [[this.name, 100/this.allScoreRate*this.scoreRate], ['autres', (100/this.allScoreRate*(this.allScoreRate-this.scoreRate))]];
        console.log(this.amount, this.allAmount);
        this.amountChart = [[this.name, this.amount], ['autres', (this.allAmount-this.amount)]];
      }
    );
  }


}