import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';


import {Order} from '../../../../models/order.model';
import {OrderDataStorageService} from '../../../../services/data-storage/order-data-storage.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit {
  orderId: number;

  order: Order;
  orders: Order[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private orderDataStorageService: OrderDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.orderId = +params['orderId'];
        }
      );
    }
  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Order[]) => {
        this.orders = data['order'];
        this.order = this.orders.find( x => x.Id === this.orderId);
      }
    );

  }

  confirmEvent() {
    this.orderDataStorageService.deleteOrder(this.orderId).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/orders']);
      }
    );
  }

  deleteOrder() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog) {
      this.confirmEvent();
    }
  }

}



