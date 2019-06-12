import * as moment from 'moment';
import {NgForm} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {Order} from '../../../../models/order.model';
import {Table} from '../../../../models/table.model';
import {FoodItem} from '../../../../models/food-item.model';
import {AdminService} from '../../../../services/shared/admin.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  filteredOrders: Order[] = [];

  tables: Table[] = [];

  displayedColumns: string[] =
    [
      'Id',
      'DateTime',
      'GrossTotalPrice',
      'TableId',
      'CurrentState'
    ];

  dataSource: MatTableDataSource<Order>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private route: ActivatedRoute,
              public adminService: AdminService) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.orders = data['orders'];
        this.tables = data['tables'];
        this.filteredOrders = this.orders;
        this.dataSource = new MatTableDataSource(this.orders);
      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.data = [];
    this.dataSource.data = this.orders;

    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.filteredOrders = this.dataSource.data;
  }

  defaultOrders() {
    this.dataSource.data = [];
    this.dataSource.data = this.orders;
    this.filteredOrders = this.orders;
  }

  filterOrdersByDate(form: NgForm) {
    const startDate = moment(form.value.date[0], 'h:mm:ss A, Do MMMM YYYY');
    const endDate = moment(form.value.date[1], 'h:mm:ss A, Do MMMM YYYY');
    this.filteredOrders = [];
    this.dataSource.data = [];

    for (let i = 0; i < this.orders.length; i++) {
      const ifDateExist = this.orders[i].OrderSessions[0].OrderedDateTime;
      const ifTrue = moment(ifDateExist,  'h:mm:ss A, Do MMMM YYYY').
      isBetween(startDate, endDate, 'day', '[]');

      if (ifTrue) {
        this.filteredOrders.push(this.orders[i]);
      }
    }
    this.dataSource.data = this.filteredOrders;
  }


  getOrderReport(type: string) {
    if (type === 'totalSellingAmount') {
      let totalSellingAmount = 0;
      this.filteredOrders.forEach( (x) => {
        totalSellingAmount += x.GrossTotalPrice;
      });

      return totalSellingAmount;
    }

    if (type === 'totalInventoryCost') {
      let totalInventoryCost = 0;
      this.filteredOrders.forEach( (x) => {
        totalInventoryCost += x.InventoryCost;
      });

      return totalInventoryCost;
    }

    if (type === 'totalProfitGained') {
      let totalProfitGained = 0;
      this.filteredOrders.forEach( (x) => {
        totalProfitGained += x.Profit;
      });

      return totalProfitGained;
    }

    if (type === 'totalDiscountGiven') {
      let totalDiscountGiven = 0;
      this.filteredOrders.forEach( (x) => {
        totalDiscountGiven += x.DiscountAmount;
      });

      return totalDiscountGiven;
    }

    if (type === 'totalVatCollected') {
      let totalVatCollected = 0;
      this.filteredOrders.forEach( (x) => {
        totalVatCollected += x.VatAmount;
      });
      return totalVatCollected;
    }

    if (type === 'totalServiceChargeCollected') {
      let totalServiceChargeCollected = 0;
      this.filteredOrders.forEach( (x) => {
        totalServiceChargeCollected += x.ServiceChargeAmount;
      });
      return totalServiceChargeCollected;
    }

    return '';
  }

}

