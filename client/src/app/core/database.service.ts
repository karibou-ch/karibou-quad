import { Injectable } from '@angular/core';
import { Http, Response } from "@angular/http";
import {Observable} from "rxjs";
import 'rxjs/Rx';

const url = "http://localhost:8080/";

@Injectable()
export class DatabaseService {

  constructor(private http: Http) { }

  vendor(id: string): Observable<any> {
    return this.http.get(url + 'vendors/' + id).map(
      (r: Response) => r.json()[0]
    );
  }

  vendors(): Observable<any[]> {
    return this.http.get(url + 'vendors/').map(
      (r: Response) => r.json()
    );
  }

  issues_per_dates(id: string) {
    return this.http.get(url + `vendors/${id}/date`).map(
      (r: Response) => r.json()
    );
  }

}
