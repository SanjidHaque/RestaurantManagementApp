import {ActivatedRoute} from '@angular/router';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';

import {Table} from '../../../../models/table.model';
import {Order} from '../../../../models/order.model';
import {FoodItem} from '../../../../models/food-item.model';
import {AdminService} from '../../../../services/shared/admin.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})

export class OrderListComponent implements OnInit, AfterViewInit {
  orders: Order[] = [];
  tables: Table[] = [];

  displayedColumns: string[] =
    [
      'Id',
      'DateTime',
      'GrossTotalPrice',
      'InventoryCost',
      'Profit',
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
        this.dataSource = new MatTableDataSource(this.orders);

      }
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  filterOrdersByDate() {
    // const startDate = new Date('3rd June 2019');
    //
    // console.log(startDate);
    //
    // const endDate = new Date('3rd June 2019');
    //
    // const selectedMembers = this.orders.filter(
    //   m => new Date(m.DateTime) > startDate && new Date(m.DateTime) < endDate);
    //
    //
    // console.log(selectedMembers);


   // moment().format('h:mm:ss A, Do MMMM YYYY');



    const compareDate = moment('12:03:50 AM, 3rd June 2019', 'h:mm:ss A, Do MMMM YYYY');

    const startDate   = moment('12:03:50 AM, 3rd June 2019', 'h:mm:ss A, Do MMMM YYYY');
    const endDate     = moment('12:03:51 AM, 3rd June 2019', 'h:mm:ss A, Do MMMM YYYY');

    const getDate = moment( new Date('Mon Jun 03 2019 23:41:33 GMT+0600 (Bangladesh Standard Time)'))
      .format('h:mm:ss A, Do MMMM YYYY');

    console.log(getDate);
// omitting the optional third parameter, 'units'
    compareDate.isBetween(startDate, endDate);
    // console.log(compareDate.isBetween(startDate, endDate, null, '[]'));
  }

}

