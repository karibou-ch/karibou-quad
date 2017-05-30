import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../core/database.service";
import * as _ from 'lodash';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrls: ['./vendor-list.component.css']
})
export class VendorListComponent implements OnInit {

  private vendors: any[];

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.databaseService.vendors().subscribe(
      vendors => {

        // TODO (jca): compute, transform and sort these fields into the API Rest Server. See doc at:
        // https://github.com/karibou-ch/karibou-quad/wiki/Developpement#user-content-améliorations-et-poursuite-des-travaux

        vendors.forEach( v => v['score_rate'] = Math.round(v['score']/v['nb_items']*1000)/10);
        vendors.forEach( v => v['score_transactions_rate'] = Math.round(v['score']/v['nb_transactions']*1000)/10);
        vendors.forEach( v => v['amount'] = Math.round(v['amount']*100)/100);
        vendors.forEach( v => v['impacted_customers'] = _.chain(v['customers_details']).filter(d => d.score > 0).value().length);
        this.vendors = _
          .chain(vendors)
          .sortBy(v => v['score_transactions_rate'])
          .reverse()
          .value();
      });
  }

}
