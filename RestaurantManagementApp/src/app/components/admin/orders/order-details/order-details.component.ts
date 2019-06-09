import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Table} from '../../../../models/table.model';
import {Order} from '../../../../models/order.model';
import {Setting} from '../../../../models/setting.model';
import {FoodItem} from '../../../../models/food-item.model';
import {OrderSession} from '../../../../models/order-session.model';
import {OrderDataStorageService} from '../../../../services/data-storage/order-data-storage.service';

@Component({
  selector: 'app-order-details',
  templateUrl: './order-details.component.html',
  styleUrls: ['./order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit {
  isDisabled = false;

  orderId: number;
  order: Order;
  setting: Setting;

  orders: Order[] = [];
  tables: Table[] = [];
  foodItems: FoodItem[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
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
        this.orders = data['orders'];
        this.tables = data['tables'];
        this.foodItems = data['foodItems'];
        this.setting = data['setting'];

        this.order = this.orders.find( x => x.Id === this.orderId);

        if (this.order === undefined ) {
          this.toastr.errorToastr('Order not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/orders']);
        }
      }
    );

  }

  getSessionTotalPrice(orderSession: OrderSession) {
    let totalPrice = 0;
    orderSession.OrderedItems.forEach((value) => { totalPrice += value.TotalPrice; });
    return totalPrice;
  }


  getFoodItemInformation(type: string, foodItemId: number) {
    const foodItem = this.foodItems.find(x => x.Id === foodItemId);
    if (foodItem === undefined || foodItem === null) {
      return '';
    }
    if (type === 'Name and Serial') {
      return foodItem.SerialNumber + '. ' + foodItem.Name;
    }
    if (type === 'Price') {
      return foodItem.Price;
    }
  }


  deleteOrder() {
    if (!confirm('Delete this order?\n' +
      'You will lose any kind of data associated with the current order!')) {
     return;
    }

    this.isDisabled = true;
    this.orderDataStorageService.deleteOrder(this.orderId).subscribe((data: any) => {
      if (data === 'Order not found') {
        this.isDisabled = false;
        this.toastr.errorToastr( data,  'Error', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        return;
      }

      this.toastr.successToastr( 'Order deleted successfully',  'Error', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });

      this.router.navigate(['admin/orders']);
    });

  }

}



