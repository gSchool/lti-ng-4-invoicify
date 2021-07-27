import { Injectable } from "@angular/core";
import { Http, Response, RequestOptions, Headers } from "@angular/http";

import { Observable } from "rxjs/Observable";
import "rxjs/add/operator/catch";
import "rxjs/add/observable/throw";
import "rxjs/add/operator/map";
import "rxjs/add/operator/expand";
import "rxjs/add/observable/empty";

@Injectable()
export class DataService {
  
  private dev: boolean = false;

  private baseUrl = this.dev ? "http://localhost:8080/api/" : "https://stark-fjord-86269.herokuapp.com/api/";

  found: boolean = false;

  headers: Headers = new Headers();

  options: RequestOptions = new RequestOptions({ withCredentials: true });

  constructor(private http: Http) {
    // this.headers.append('Content-Type', 'application/json');
    // this.headers.append('Access-Control-Allow-Origin', '*');
  }

  getRecords(endpoint: string): Observable<any[]> {
    let apiUrl = this.baseUrl + endpoint;
    return this.http
      .get(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  getRecord(endpoint: string, id: number): Observable<object> {
    let apiUrl = `${this.baseUrl}${endpoint}/${id}`;
    return this.http
      .get(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  deleteRecord(endpoint: string, id?: number): Observable<object> {
    let apiUrl = `${this.baseUrl}${endpoint}`;
    apiUrl = id ? apiUrl + "/" + id : apiUrl;
    return this.http
      .delete(apiUrl, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  editRecord(
    endpoint: string,
    record: object,
    id?: number
  ): Observable<object> {
    let apiUrl = `${this.baseUrl}${endpoint}`;
    apiUrl = id ? apiUrl + "/" + id : apiUrl;
    return this.http
      .put(apiUrl, record, this.options)
      .map(this.extractData)
      .catch(this.handleError);
  }

  addRecord(endpoint: string, record: object): Observable<any> {
    let apiUrl = `${this.baseUrl}${endpoint}`;
    return this.http.post(apiUrl, record, this.options).map(this.extractData);
  }

  private extractData(res: Response) {
      console.log('res', res);
    let results = res.json();
    return results || [];
  }

  private handleError(error: Response | any) {
    // In a real world app, you might use a remote logging infrastructure
    let errMsg: string;
    if (typeof error._body === "string") {
      try {
        errMsg = JSON.parse(error._body).message;
        if (errMsg.includes("ConstraintViolationException")) {
          errMsg =
            "Cannot delete record because it has related to other records.";
        }
      } catch (error) {
        errMsg = error._body;
      }
    } else {
      if (error instanceof Response) {
        if (error.status === 0) {
          errMsg = "Error connecting to API";
        } else {
          const errorJSON = error.json();
          errMsg = errorJSON.message;
        }
      }
    }

    return Observable.throw(errMsg);
  }
}
