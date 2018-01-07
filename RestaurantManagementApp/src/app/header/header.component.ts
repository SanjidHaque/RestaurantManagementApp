import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../our-offers/our-offers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  public quantity : number = 0;

  constructor(private _ourOfferService: OurOffersService ) {
  }

  ngOnInit() {
    // this.quantity += this._ourOfferService.totalQuantity;

  }



}
