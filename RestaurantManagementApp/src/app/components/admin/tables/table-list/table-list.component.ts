import {ActivatedRoute} from '@angular/router';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import {Table} from '../../../../models/table.model';

@Component({
  selector: 'app-table-list',
  templateUrl: './table-list.component.html',
  styleUrls: ['./table-list.component.scss']
})
export class TableListComponent implements OnInit, AfterViewInit {

  tables: Table[] = [];


  displayedColumns: string[] =
    [
      'Name',
      'CurrentState',
      'TotalOrders'
    ];
  dataSource: MatTableDataSource<Table>;
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Table[]) => {
          this.tables = data['tables'];
          this.dataSource = new MatTableDataSource(this.tables);
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
