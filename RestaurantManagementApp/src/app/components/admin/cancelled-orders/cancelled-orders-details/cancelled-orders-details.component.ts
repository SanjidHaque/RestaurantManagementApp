import {Component, OnInit} from '@angular/core';
import {Order} from '../../../../models/order.model';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Table} from '../../../../models/table.model';
import {FoodItem} from '../../../../models/food-item.model';
import {OrderedItem} from '../../../../models/ordered-item.model';
import {OrderSession} from '../../../../models/order-session.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {OrderDataStorageService} from '../../../../services/data-storage/order-data-storage.service';

@Component({
  selector: 'app-cancelled-orders-details',
  templateUrl: './cancelled-orders-details.component.html',
  styleUrls: ['./cancelled-orders-details.component.scss']
})
export class CancelledOrdersDetailsComponent implements OnInit {
  isDisabled = false;
  orders: Order[] = [];
  cancelledOrderedItem: OrderedItem;

  tables: Table[] = [];
  foodItems: FoodItem[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              public adminService: AdminService,
              private toastr: ToastrManager,
              private orderDataStorageService: OrderDataStorageService) {
  }

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Data) => {
          this.orders = data['orders'];
          this.cancelledOrderedItem = data['cancelledOrderedItem'];

          if (this.cancelledOrderedItem === undefined ) {
            this.toastr.errorToastr('Error', 'Resource not found');
            this.router.navigate(['admin/cancelled-orders']);
          }

          this.tables = data['tables'];
          this.foodItems = data['foodItems'];
        });
  }




  getOrderedItemInformation(type: string) {
    let orderSession: OrderSession;
    for (let i = 0; i < this.orders.length; i++) {
      for (let j = 0; j < this.orders[i].OrderSessions.length; j++) {
        orderSession = this.orders[i].OrderSessions
          .find(x => x.Id === this.cancelledOrderedItem.OrderSessionId);
      }
      if (orderSession !== undefined) {
        break;
      }
    }

    if (orderSession === undefined) {
      return '';
    }

    const order = this.orders.find(x => x.Id === orderSession.OrderId);
    if (order === undefined) {
      return '';
    }

    if (type === 'dateTime') {
      return order.DateTime;
    } else if (type === 'tableName') {
      return this.adminService.getTableName(this.tables, order.TableId);
    } else {
      return order.SalesPersonName;
    }
  }


  getFoodItemInformation(type: string) {
    const foodItem = this.foodItems
      .find(x => x.Id === this.cancelledOrderedItem.FoodItemId);
    if (foodItem === undefined) {
      return 'Not found';
    }

    if (type === 'Name and Serial') {
      return foodItem.SerialNumber + '. ' + foodItem.Name;
    } else {
      return foodItem.Price;
    }
  }


  deleteCancelledOrderedItem() {
    if (!confirm('Delete this record?\n' +
      'You will lose any kind of data associated with the current record!')) {
      return;
    }

    this.isDisabled = true;
    this.orderDataStorageService.deleteCancelledOrderedItem(this.cancelledOrderedItem.Id)
      .subscribe((data: any) => {
        if (data.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(data.StatusText, 'Error');
          return;
        }
        this.toastr.successToastr('Record deleted successfully', 'Success');
        this.router.navigate(['admin/cancelled-orders']);
      });
  }
}
