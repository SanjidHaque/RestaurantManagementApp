import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Table} from '../../../../models/table.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';

@Component({
  selector: 'app-table-details',
  templateUrl: './table-details.component.html',
  styleUrls: ['./table-details.component.scss']
})
export class TableDetailsComponent implements OnInit {
  isDisabled = false;
  table: Table;

  constructor(private router: Router,
              private route: ActivatedRoute,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) {
  }

  ngOnInit() {
    this.route.data.subscribe(
      (data: Data) => {
        this.table = data['table'];

        if (this.table === null || this.table === undefined) {
          this.toastr.errorToastr('Table not found', 'Error');
          this.router.navigate(['admin/tables']);
        }
      });
  }

  deleteTable() {
    const dialog = confirm('Delete this table?\n' +
      'You will lose any kind of data associated with the current table!');
    if (dialog === true) {
      this.confirmEvent();
    }
  }

  confirmEvent() {
    this.tableDataStorageService.deleteTable(this.table.Id).
    subscribe(
      (data: any) => {
        if (data.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(data.StatusText, 'Error');
          return;
        }

        this.toastr.successToastr('Removed from shop', 'Success');
        this.router.navigate(['admin/tables']);
      });
  }

}
