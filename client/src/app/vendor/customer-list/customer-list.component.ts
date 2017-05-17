import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

  @Input() customers: any[];
  @Input() vendor: any;

  constructor() { }

  ngOnInit() {
  }

  private goTo(id: any): void {
    console.log(id);
    console.log(id['floatApprox']);
    console.log(this.vendor._id);
    if (id['floatApprox'] === undefined){
      window.open(`http://localhost:8080/transactions/${this.vendor._id}/${id}/`, '_blank');
    }else{
      console.log("ouoiu", id.floatApprox);
      window.open(`http://localhost:8080/transactions/${this.vendor._id}/${id.floatApprox}/`, '_blank');
    }
  }

}
