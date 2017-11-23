import { Injectable } from '@angular/core';
import {Http} from '@angular/http';
import { Response} from '@angular/http';

import 'rxjs/add/operator/map';
import {Observable} from 'rxjs/Observable';



@Injectable()
export class OurOffersService {
  private _url = 'assets/set-menu.json';
  constructor(private _http: Http) { }
  getSetMenu() {
return this._http.get(this._url)
  .map((response: Response) => response.json());
  }
}
