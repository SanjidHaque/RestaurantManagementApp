import * as moment from 'moment';
import {FormBuilder, FormControl, FormGroup, NgForm} from '@angular/forms';
import {ActivatedRoute, Data} from '@angular/router';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

import {Order} from '../../../../models/order.model';
import {Table} from '../../../../models/table.model';
import {FoodItem} from '../../../../models/food-item.model';
import {OrderedItem} from '../../../../models/ordered-item.model';
import {OrderSession} from '../../../../models/order-session.model';

@Component({
  selector: 'app-cancelled-orders-list',
  templateUrl: './cancelled-orders-list.component.html',
  styleUrls: ['./cancelled-orders-list.component.scss']
})
export class CancelledOrdersListComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  tables: Table[] = [];
  foodItems: FoodItem[] = [];

  cancelledOrderedItems: OrderedItem[] = [];
  filteredCancelledOrderedItems: OrderedItem[] = [];
  dateForm: FormGroup;

  displayedColumns: string[] =
    [
      'OrderSessionId',
      'FoodItemId',
      'FoodItemQuantity',
      'TotalPrice'
    ];

  dataSource: MatTableDataSource<OrderedItem>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.dateForm = new FormGroup({
      date: new FormControl('')
    });

    this.route.data.subscribe(
      ( data: Data) => {
        this.orders = data['orders'];
        this.cancelledOrderedItems = data['cancelledOrderedItems'];

        this.tables = data['tables'];
        this.foodItems = data['foodItems'];
        this.dataSource = new MatTableDataSource(this.cancelledOrderedItems);
        this.filteredCancelledOrderedItems = this.cancelledOrderedItems;
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  s() {
    console.log(this.dateForm.controls['date'].value.begin);
  }


  applyFilter(filterValue: string) {
    this.dataSource.data = [];
    this.dataSource.data = this.cancelledOrderedItems;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }

    this.filteredCancelledOrderedItems = this.dataSource.data;
  }



  defaultOrders() {
    this.dataSource.data = [];
    this.dataSource.data = this.cancelledOrderedItems;
    this.filteredCancelledOrderedItems = this.cancelledOrderedItems;
  }

  filterOrdersByDate() {
    const startDate = moment(this.dateForm.controls['date'].value.begin, 'h:mm:ss A, Do MMMM YYYY');
    const endDate = moment(this.dateForm.controls['date'].value.end, 'h:mm:ss A, Do MMMM YYYY');

    this.filteredCancelledOrderedItems = [];
    this.dataSource.data = [];

    for (let i = 0; i < this.cancelledOrderedItems.length; i++) {

      const getDateTime = this.getOrderedItemInformation(this.cancelledOrderedItems[i].OrderSessionId);

      const ifTrue = moment(getDateTime,  'h:mm:ss A, Do MMMM YYYY').
      isBetween(startDate, endDate, 'day', '[]');

      if (ifTrue) {
        this.filteredCancelledOrderedItems.push(this.cancelledOrderedItems[i]);
      }
    }
    this.dataSource.data = this.filteredCancelledOrderedItems;
  }


  getOrderedItemInformation(orderSessionId: number) {
    let orderSession: OrderSession;
    for (let i = 0; i < this.orders.length; i++) {
      for (let j = 0; j < this.orders[i].OrderSessions.length; j++) {
        orderSession = this.orders[i].OrderSessions.find(x => x.Id === orderSessionId);
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

    return order.DateTime;
  }

  getFoodItemName(foodItemId: number) {
    const foodItem = this.foodItems.find(x => x.Id === foodItemId);
    if (foodItem === undefined) {
      return 'Not found';
    }

    return foodItem.SerialNumber + '. ' + foodItem.Name;
  }


  getTotalCancelledOrderedPrice() {
    let totalPrice = 0;
    this.filteredCancelledOrderedItems.forEach((x) => {
      totalPrice += x.TotalPrice;
    });
    return totalPrice;
  }

}
