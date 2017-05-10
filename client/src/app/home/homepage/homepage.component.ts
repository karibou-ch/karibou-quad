import { Component, OnInit } from '@angular/core';
import {DatabaseService} from "../../core/database.service";

@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
export class HomepageComponent implements OnInit {

  private vendors: any[];
  private activePanel: string = "vendors-panel";

  constructor(private databaseService: DatabaseService) { }

  ngOnInit() {
    this.databaseService.vendors().subscribe(
      vendors => {
        vendors.forEach( v => v['score_rate'] = Math.round(v['score_rate']*10)/10);
        this.vendors = vendors;
      });
  }

}
