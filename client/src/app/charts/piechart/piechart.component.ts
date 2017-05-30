import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js'
import * as _ from 'lodash';
import {Router} from "@angular/router";

@Component({
  selector: 'app-piechart',
  templateUrl: './piechart.component.html',
  styleUrls: ['./piechart.component.css']
})
export class PiechartComponent implements OnInit {

  @ViewChild('piechart') private chartContainer: ElementRef;

  // TODO: Describe more precisely the input structure
  @Input() private data: Array<any>;
  @Input() private title: string = "";

  private myChart: Chart;

  constructor(private router: Router) { }

  ngOnInit() {

  }

  ngOnChanges(){
    // Fix/Hack: Clear all old chart
    if (this.myChart !== undefined){
      this.myChart.destroy();
    }

    const ctx = this.chartContainer.nativeElement;
    //const backgroundColors = ['rgba(255,0,0,0.5)'].concat(this.data.map( _ => 'rgba(153, 102, 255, 0.5)'));
    const backgroundColors = _.range(this.data.length).map( i => this.fillRgb(i, this.data.length, 0.5));
    const borderColors = this.data.map( _ => 'rgba(0,0,0,0.2)');
    this.myChart = new Chart(ctx, {
      type: 'pie',
      data: {
        labels: this.data.map( v => v[0] ),
        datasets: [{
          data: this.data.map( v => v[1]),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
        }]
      },
      options: {
        legend: {
          display: true
        }
      }
    });
  }

  private fillRgb(i: number, n: number, a: number = 1): string {
    if (i === 0)
      return 'rgba(255,0,0,0.5)';
    const r = 0;
    const g = Math.floor((i/n * 2))*255;
    const b = (i+1)/n * 255;
    return `rgba(${r},${g},${b}, ${a})`;

  }
}
