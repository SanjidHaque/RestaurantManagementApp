import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {PointOfSaleService} from '../../../../../services/point-of-sale.service';
import {TableDataStorageService} from '../../../../../services/table-data-storage.service';
import {OrderedItem} from '../../../../../models/ordered-item.model';
import {Order} from '../../../../../models/order.model';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit {
  orderId: number;
  order: Order;
  orders: Order[] = [];
  orderedItems: OrderedItem[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: TableDataStorageService,
              private pointOfSaleService: PointOfSaleService,
              ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.orderId = params['inventoryId'];
        }
      );
    }
  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Order[]) => {
        this.pointOfSaleService.order = data['order'];
      }
    );
    this.orders = this.pointOfSaleService.orders;
    this.pointOfSaleService.ordersChanged
      .subscribe(
        (order: Order[]) => {
          this.orders = order;
        }
      );

    for (let i = 0; i < this.orders.length; i++) {
      if (this.orders[i].Id === this.orderId) {
        this.order = this.orders[i];
        this.orderedItems = this.orders[i].OrderedItem;
      }
    }
  }


  goBack() {
    this.router.navigate(['admin/order/list-view']);
  }


  confirmEvent() {
    this.pointOfSaleService.deleteOrder(this.order);
    this.dataStorageService.deleteOrder(this.order).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/order/grid-view']);
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



