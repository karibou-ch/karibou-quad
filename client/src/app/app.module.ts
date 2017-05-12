import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { MdlModule } from '@angular-mdl/core';
import { HomepageComponent } from './home/homepage/homepage.component';
import {DatabaseService} from "./core/database.service";
import { VendorLineComponent } from './home/vendor-line/vendor-line.component';
import { RouterModule } from '@angular/router';
import { VendorComponent } from './vendor/vendor/vendor.component';
import { BarchartComponent } from './charts/barchart/barchart.component';
import { VendorListComponent } from './vendor/vendor-list/vendor-list.component';


@NgModule({
  declarations: [
    AppComponent,
    HomepageComponent,
    VendorLineComponent,
    VendorComponent,
    BarchartComponent,
    VendorListComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MdlModule,
    RouterModule.forRoot([
      {
        path: '',
        redirectTo: '/vendor',
        pathMatch: 'full'
      },
      {
        path: 'vendor',
        component: VendorListComponent
      },
      {
        path: 'vendor/:id',
        component: VendorComponent
      }
    ])
  ],
  providers: [ DatabaseService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
