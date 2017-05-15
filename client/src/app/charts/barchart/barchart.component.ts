import {Component, OnInit, Input, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import * as _ from 'lodash';
import Chart from 'chart.js'
import {Router} from "@angular/router";

@Component({
  selector: 'app-barchart',
  templateUrl: './barchart.component.html',
  styleUrls: ['./barchart.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BarchartComponent implements OnInit {

  @ViewChild('barchart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  @Input() private title: string = "";

  private myChart: Chart;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges(){

    // Fix: Clear all old chart
    if (this.myChart !== undefined){
      this.myChart.destroy();
    }

    const ctx = this.chartContainer.nativeElement;
    const backgroundColors = ['rgba(255, 99, 132, 0.5)'].concat(this.data.map( _ => 'rgba(153, 102, 255, 0.5)'));
    const borderColors = ['rgba(255,99,132,1)'].concat(this.data.map( _ => 'rgba(153,102,255,1)'));
    this.myChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: this.data.map( v => v[0] ),
        datasets: [{
          label: 'Valeurs',
          data: this.data.map( v => v[1]),
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1
        }]
      },
      options: {
        onClick: (evt, i) => {
          if (i[0] !== undefined) {
            const label = i[0]._model.label;
            this.router.navigate(['vendor', label]);
          }
        },
        legend: {
          display:false
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }

}
