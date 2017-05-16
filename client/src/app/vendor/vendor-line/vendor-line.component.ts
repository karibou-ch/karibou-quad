import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-vendor-line',
  templateUrl: './vendor-line.component.html',
  styleUrls: ['./vendor-line.component.css']
})
export class VendorLineComponent implements OnInit {

  @Input() vendor: any;

  constructor() { }

  ngOnInit() {
    this.vendor['impacted_customers_rate'] = Math.round(this.vendor['impacted_customers'] / this.vendor['customers'] * 1000)/10;
  }

  private isItemDanger(): boolean {
    return this.vendor.score_rate >= 4;
  }

  private isItemWarning(): boolean {
    return this.vendor.score_rate >= 2 && this.vendor.score_rate < 4;
  }

  private isTransactionDanger(): boolean {
    return this.vendor.score_transactions_rate >= 4;
  }

  private isTransactionWarning(): boolean {
    return this.vendor.score_transactions_rate >= 2 && this.vendor.score_transactions_rate < 4;
  }

  private isCustomerDanger(): boolean {
    return this.vendor.impacted_customers_rate >= 5;
  }

  private isCustomerWarning(): boolean {
    return this.vendor.impacted_customers_rate >= 2 && this.vendor.impacted_customers_rate < 5;
  }

}
