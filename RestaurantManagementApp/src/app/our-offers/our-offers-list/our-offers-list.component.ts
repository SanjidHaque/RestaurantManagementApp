import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../our-offers.service';

@Component({
  selector: 'app-our-offers-list',
  templateUrl: './our-offers-list.component.html',
  styleUrls: ['./our-offers-list.component.scss']
})
export class OurOffersListComponent implements OnInit {

  setMenus = [];
  constructor(private _ourOfferService: OurOffersService) { }

  ngOnInit() {
    this._ourOfferService.getSetMenu()
      .subscribe(
        responseToSetMenu => this.setMenus = responseToSetMenu
      );
  }
}
