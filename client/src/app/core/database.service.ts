import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/Rx';

const url = "http://localhost:8080/";

@Injectable()
export class DatabaseService {

  constructor(private http: Http) { }

  /**
   * Returns vendor statistics
   * @param id - the vendor's id
   * @returns {Observable<any>} - a vendor statistics in an observable object
   */
  vendor(id: string): Observable<any> {
    return this.http.get(url + 'vendors/' + id).map(
      (r: Response) => r.json()[0]
    );
  }

  /**
   * Returns all vendors statistics
   * @returns {Observable<any[]>} - a list of vendors statistics in an observable list object
   */
  vendors(): Observable<any[]> {
    return this.http.get(url + 'vendors/').map(
      (r: Response) => r.json()
    );
  }

  /**
   * Returns vendor statistics grouped by date
   * @param id - the vendor's id
   * @returns {Observable<any>} - a vendor statistics grouped by date
   */
  issues_per_dates(id: string) {
    return this.http.get(url + `vendors/${id}/date`).map(
      (r: Response) => r.json()
    );
  }

}
