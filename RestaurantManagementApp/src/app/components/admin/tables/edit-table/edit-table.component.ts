import {NgForm} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Table} from '../../../../models/table.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent implements OnInit {
  isDisabled = false;
  tableId: number;

  tables: Table[];
  table: Table;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.tableId = +params['tableId'];
        }
      );
  }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: Table[]) => {
        this.tables = data['tables'];
        this.table = this.tables.find( x => x.Id === this.tableId);

        if (this.table === undefined) {
          this.toastr.errorToastr('Table is not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/tables']);
        }
      }
    );
  }



  editTable(form: NgForm) {
    this.isDisabled = true;
    const tableName = form.value.name;

    if (tableName !== this.table.Name) {
      this.tableDataStorageService.editTable(new Table(this.tableId, tableName))
        .subscribe(
          (data: any) => {
            this.toastr.successToastr('Information is updated', 'Success', {
              toastTimeout: 10000,
              newestOnTop: true,
              showCloseButton: true
            });
            form.reset();
            this.router.navigate(['admin/tables']);
          }
        );
    } else {
      this.toastr.successToastr('Information is updated', 'Success', {
        toastTimeout: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      form.reset();
      this.router.navigate(['admin/tables']);
    }
  }
}
