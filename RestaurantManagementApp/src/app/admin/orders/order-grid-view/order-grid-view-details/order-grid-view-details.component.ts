import { Component, OnInit } from '@angular/core';
import {OurOffersService} from '../../../../services/our-offers.service';
import {DataStorageService} from '../../../../services/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OrderedItem} from '../../../../models/ordered-item.model';
import {Order} from '../../../../models/order.model';

@Component({
  selector: 'app-order-grid-view-details',
  templateUrl: './order-grid-view-details.component.html',
  styleUrls: ['./order-grid-view-details.component.scss']
})
export class OrderGridViewDetailsComponent implements OnInit {

  orderId: string;
  order: Order;
  orderLists: Order[] = [];
  orderedItems: OrderedItem[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private ourOffersService: OurOffersService,
              ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.orderId = params['id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Order[]) => {
        this.ourOffersService.ordersList = data['orders'];
      }
    );
    this.orderLists = this.ourOffersService.ordersList;
    this.ourOffersService.ordersListChanged
      .subscribe(
        (order: Order[]) => {
          this.orderLists = order;
        }
      );

    for (let i = 0; i < this.orderLists.length; i++) {
      if (this.orderLists[i].Id === this.orderId) {
        this.order = this.orderLists[i];
        this.orderedItems = this.orderLists[i].OrderedItem;
      }
    }
  }


  goBack() {
    this.router.navigate(['admin/orders/grid-view']);
  }


  confirmEvent() {
    this.ourOffersService.deleteOrder(this.order);
    this.dataStorageService.deleteOrder(this.order).
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
