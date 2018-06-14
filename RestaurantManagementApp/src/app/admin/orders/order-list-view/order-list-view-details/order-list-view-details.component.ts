import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {Order} from '../../../../shared/order.model';
import {OrderedItems} from '../../../../shared/ordered-items.model';
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

  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              ) {
    this._route.params
      .subscribe(
        (params: Params) => {
          this.orderId = params['id'];
        }
      );
    }
  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: Order[]) => {
        this._ourOfferService.ordersList = data['orders'];
      }
    );
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
    this._dataStorageService.deleteOrder(this.order).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/orders/grid-view']);
      }
    );
  }


  deleteOrder() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

}



