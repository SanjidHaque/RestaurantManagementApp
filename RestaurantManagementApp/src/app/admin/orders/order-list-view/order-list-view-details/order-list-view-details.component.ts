import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Http} from '@angular/http';
import {LocationStrategy} from '@angular/common';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {Order} from '../../../../shared/order.model';
import {OrderedItems} from '../../../../shared/ordered-items.model';
import {Popup} from 'ng2-opd-popup';
@Component({
  selector: 'app-order-list-view-details',
  templateUrl: './order-list-view-details.component.html',
  styleUrls: ['./order-list-view-details.component.scss']
})
export class OrderListViewDetailsComponent implements OnInit {
  orderId: string;
  order: Order;
  orderLists: Order[] = [];
  orderedItems: OrderedItems[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private popup: Popup,
              private _ourOfferService: OurOffersService,
              ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.orderId = params['id'];
        }
      );
    }
  ngOnInit() {
    this.orderLists = this._ourOfferService.ordersList;
    this._ourOfferService.ordersListChanged
      .subscribe(
        (order: Order[]) => {
          this.orderLists = order;
        }
      );

    for (let i = 0; i < this.orderLists.length; i++) {
      if (this.orderLists[i].Id === this.orderId) {
        this.order = this.orderLists[i];
        this.orderedItems = this.orderLists[i].OrderedItems;
      }
    }
  }


  goBack() {
    this.router.navigate(['admin/orders/list-view']);
  }


  confirmEvent() {
    this._ourOfferService.deleteOrder(this.order);
    this._dataStorageService.deleteOrder(this.order);
    this.router.navigate(['admin/orders/list-view']);
    this.popup.hide();
  }

  cancelEvent() {
    this.popup.hide();
  }
  deleteOrder() {
    this.popup.options = {
      header: 'Delete This Order?',
      color: '#760000', // red, blue....
      widthProsentage: 50, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }

}



