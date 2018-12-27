import { Injectable } from '@angular/core';

import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/Rx';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/observable/throw';
import 'rxjs/add/observable/of';
import { ResponseType } from '@angular/http';


const bodyless = ['get', 'head', 'delete', 'options'];

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  public endpoint = environment.backendEndpoint;
  public config = null;

  private configLoadFailed = false;

  token: string = null;

  constructor(
    private http: HttpClient
  ) {
    this.http.get('/config', {responseType: 'json'})
    .subscribe((config: any) => {
      this.config = config;
      this.endpoint = config.backendEndpoint;
    });
  }

  _checkConfig(): Observable<any> {
    if (this.config) {
      return Observable.of(this.config);
    } else if (this.configLoadFailed) {
      return Observable.of(environment);
    } else {
      return this.http.get('/config', {responseType: 'json'} )
      .map((config: any) => {
        this.config = config;
        this.endpoint = config.backendEndpoint;
        return config;
      })
      .catch((err: any) => {
        this.configLoadFailed = true;
        return Observable.of(environment);
      });
    }
  }

  request(method: string, uri: string, payload: any = null): Observable<any> {
    return this._checkConfig()
    .map(config => {
      let headers: HttpHeaders = new HttpHeaders();
      if (this.token != null) {
        headers = headers.append('Authorization', `Bearer ${this.token}`);
      }
      const url = `${config.backendEndpoint}${uri}`;
      let result: Observable<any> = null;
      if (bodyless.indexOf(method) === -1) {
        result = this.http[method](url, payload, {headers, responseType: 'json'});
      } else {
        result = this.http[method](url, {headers});
      }
      return result.catch(e => Observable.throw(this.handleError(e)));
    })
    .mergeMap(obs => obs);
  }


  handleError(err: any) {
    console.log(err);
    
    return err;
  }

}
