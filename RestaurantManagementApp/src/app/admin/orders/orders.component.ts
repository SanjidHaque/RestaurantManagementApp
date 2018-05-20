import { Component, OnInit } from '@angular/core';
import {Order} from '../../shared/order.model';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss']
})
export class OrdersComponent implements OnInit {

  constructor(private _route: ActivatedRoute,
              private _ourOfferService: OurOffersService ) { }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: Order[]) => {
        this._ourOfferService.ordersList = data['orders'];
      }
    );
  }


}
