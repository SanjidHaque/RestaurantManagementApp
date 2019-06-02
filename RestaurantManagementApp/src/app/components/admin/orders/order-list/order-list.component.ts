import {ActivatedRoute} from '@angular/router';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatPaginator, MatSort, MatTableDataSource} from '@angular/material';

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
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

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

}

