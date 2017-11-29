import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import {OurOffers} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';


@Injectable()
export class OurOffersService {
  menuChanged = new Subject<OurOffers>();
  public menu: OurOffers;

  constructor() {
  }

  setOurOffers(menu: OurOffers) {
    this.menu = menu;
    this.menuChanged.next(this.menu/*.slice()*/);
  }
  getOurOffers() {
      return this.menu/*.slice()*/;
  }
}


