import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {Order} from '../../../../models/order.model';
import {ActivatedRoute, Data} from '@angular/router';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';
import {Table} from '../../../../models/table.model';
import {OrderedItem} from '../../../../models/ordered-item.model';
import {FoodItem} from '../../../../models/food-item.model';
import {OrderSession} from '../../../../models/order-session.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {NgForm} from '@angular/forms';
import * as moment from 'moment';

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

  constructor(private route: ActivatedRoute,
              private adminService: AdminService) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      (data: Data) => {
        this.orders = data['orders'];
        this.tables = data['tables'];
        this.foodItems = data['foodItems'];

        this.getCancelledOrderedItems();
        this.filteredCancelledOrderedItems = this.cancelledOrderedItems;
        this.dataSource = new MatTableDataSource(this.cancelledOrderedItems);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  getCancelledOrderedItems() {
    this.orders.forEach((order) => {
      order.OrderSessions.forEach((orderSession) => {
        orderSession.OrderedItems.forEach((orderedItem) => {
          if (orderedItem.CurrentState === 'Cancelled') {
            this.cancelledOrderedItems.push(orderedItem);
          }
        });
      });
    });
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

  filterOrdersByDate(form: NgForm) {
    const startDate = moment(form.value.date[0], 'h:mm:ss A, Do MMMM YYYY');
    const endDate = moment(form.value.date[1], 'h:mm:ss A, Do MMMM YYYY');
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
