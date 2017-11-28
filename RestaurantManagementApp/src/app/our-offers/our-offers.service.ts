import { Response} from '@angular/http';
import {Http} from '@angular/http';
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import {Subject} from 'rxjs/Subject';
import { SetMenu} from './our-offers.model';
import {DataStorageService} from '../shared/data-storage.service';


@Injectable()
export class OurOffersService {
  setMenuChanged = new Subject<SetMenu[]>();

  public setMenu: SetMenu[];

  constructor(){
  }

  setOurOffers(setMenu: SetMenu[]) {
    this.setMenu = setMenu;
    this.setMenuChanged.next(this.setMenu.slice());
  }
  getOurOffers() {
      return this.setMenu/*.slice()*/;
  }
}


