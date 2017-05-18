import {Component, OnInit, Input, ElementRef, ViewChild} from '@angular/core';

import Chart from 'chart.js';
import * as _ from 'lodash';

@Component({
  selector: 'app-linechart',
  templateUrl: './linechart.component.html',
  styleUrls: ['./linechart.component.css']
})
export class LinechartComponent implements OnInit {

  constructor() { }

  @ViewChild('linechart') private chartContainer: ElementRef;
  @Input() private data: Array<any>;
  @Input() private title: string = "";

  private myChart: Chart;

  ngOnInit() {
  }

  ngOnChanges(){

    // Fix: Clear all old chart
    if (this.myChart !== undefined){
      this.myChart.destroy();
    }

    const ctx = this.chartContainer.nativeElement;
    const backgroundColors = this.fillRgb(0.1);
    const borderColors = this.fillRgb(1);

    this.myChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.data['label'],
        datasets: _
          .chain(Object.keys(this.data))
          .filter( k => k !== 'label' )
          .map( (k,i) => { return {
            label: k,
            data: this.data[k],
            fill: true,
            borderColor: borderColors[i],
            pointHoverBackgroundColor: borderColors[i],
            pointHoverBorderColor: borderColors[i],
            backgroundColor: backgroundColors[i],
            pointBorderColor: borderColors[i],
            pointBackgroundColor: borderColors[i],
            pointBorderWidth: 1,
            pointHoverRadius: 5,
            pointHoverBorderWidth: 2,
            pointRadius: 1,
            pointHitRadius: 10,
            borderWidth: 2
            }}
          )
          .value()
      },
      options: {
        legend: {
          display: true
        }
      }
    });
  }

  private fillRgb(a: number = 1): string[] {

    const colors = [];
    colors.push(`rgba(255,0,0,${a}`);
    colors.push(`rgba(0,128,255,${a}`);
    colors.push(`rgba(128,255,0,${a}`);
    colors.push(`rgba(128,0,255,${a}`);
    colors.push(`rgba(153,76,0,${a}`);
    return colors;

  }
}
