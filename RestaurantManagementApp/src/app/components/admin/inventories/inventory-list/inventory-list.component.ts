import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Inventory} from '../../../../models/inventory.model';
import {MatTableDataSource} from '@angular/material';
import {MatSort} from '@angular/material';
import {MatPaginator} from '@angular/material';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit, AfterViewInit {
  inventories: Inventory[] = [];

  displayedColumns: string[] =
    [
      'Name',
      'AveragePrice',
      'Unit',
      'RemainingQuantity',
      'UsedQuantity'
    ];
  dataSource: MatTableDataSource<Inventory>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.data
      .subscribe(
        (data: Inventory[]) => {
          this.inventories = data['inventories'];
          this.dataSource = new MatTableDataSource(this.inventories);
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
