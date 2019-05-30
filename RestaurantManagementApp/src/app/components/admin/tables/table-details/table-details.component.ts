import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Table} from '../../../../models/table.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss']
})
export class TableDetailsComponent implements OnInit {

  tableId: number;
  table: Table;
  tables: Table[] = [];

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.tableId = +params['table-id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: Table[]) => {
        this.tables = data['tables'];
        this.table = this.tables.find( x => x.Id === this.tableId);

        if (this.table === undefined) {
          this.toastr.errorToastr('Table not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/tables']);
        }
      }
    );
  }

  deleteTable() {
    const dialog = confirm('Delete this table?\n' +
      'You will lose any kind of data associated with the current table!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  confirmEvent() {
    this.tableDataStorageService.deleteTable(this.tableId).
    subscribe(
      (data: any) => {
        if (data === 'Failed') {
          this.toastr.errorToastr('This table cannot be deleted for reporting purpose',
            'Error', {
              toastTimeout: 10000,
              newestOnTop: true,
              showCloseButton: true
            });
          return;
        }

        this.toastr.successToastr('Removed from shop', 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        this.router.navigate(['admin/tables']);
      });
  }

}
