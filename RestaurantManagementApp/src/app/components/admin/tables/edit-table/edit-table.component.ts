import {Component, DoCheck, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Table} from '../../../../models/table.model';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {TableDataStorageService} from '../../../../services/table-data-storage.service';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent implements OnInit, DoCheck {
  tables: Table[] ;
  tableId: number;
  tableName = '';
  subscription: Subscription;
  isDisabled = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pointOfSaleService: PointOfSaleService,
              private dataStorageService: TableDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.tableId = +params['inventoryId'];
        }
      );
  }

  ngOnInit() {
    this.tables = this.pointOfSaleService.tables;
    this.subscription = this.pointOfSaleService.tablesChanged
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
        }
      );
    for ( let i = 0; i < this.tables.length; i++) {
      if ( this.tables[i].Id === this.tableId ) {
        this.tableName = this.tables[i].Name;
      }
    }
  }

  ngDoCheck() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.tableId = params['inventoryId'];
        }
      );
    for ( let i = 0; i < this.tables.length; i++) {
      if ( this.tables[i].Id === this.tableId ) {
        this.tableName = this.tables[i].Name;
      }
    }
  }

  onEditTable(form: NgForm) {
    this.isDisabled = true;
    const name = form.value.tableName;
    const editedTable = new Table(this.tableId, name);
    const ifExist = this.pointOfSaleService.editTable(editedTable);
    if (ifExist) {
      this.dataStorageService.editTable(editedTable)
        .subscribe(
          (data: any) => {
            form.reset();
            this.router.navigate(['admin/tables']);
          }
        );
    }
  }

}
