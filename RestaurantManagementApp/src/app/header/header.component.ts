import {Component, DoCheck, OnChanges, OnInit} from '@angular/core';
import {OurOffersService} from '../our-offers/our-offers.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnChanges, DoCheck {
  public quantity : number;
  public totalPrice : number;

  constructor(private _ourOfferService: OurOffersService ) {
    this.quantity = this._ourOfferService.totalQuantity;
    this.totalPrice = this._ourOfferService.TotalPrice;
  }

  ngOnInit() {
     // this.quantity += this._ourOfferService.totalQuantity;
    // this.totalPrice += this._ourOfferService.TotalPrice;
  }

  ngOnChanges() {
   /* this.quantity += this._ourOfferService.totalQuantity;
    this.totalPrice += this._ourOfferService.TotalPrice;*/
  }

  ngDoCheck() {
     this.totalPrice = Number.parseInt(this._ourOfferService.TotalPrice.toString());
     this.quantity = Number.parseInt(this._ourOfferService.totalQuantity.toString());
     // + Number.parseInt(this.quantity.toString());
  }
}
