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
  }

  private isDanger(): boolean {
    return this.vendor.score_rate >= 4;
  }

  private isWarning(): boolean {
    return this.vendor.score_rate >= 2 && this.vendor.score_rate < 4;
  }

}
