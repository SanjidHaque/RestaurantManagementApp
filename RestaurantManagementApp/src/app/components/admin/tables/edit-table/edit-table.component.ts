import {NgForm} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Table} from '../../../../models/table.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';

@Component({
  selector: 'app-edit-table',
  templateUrl: './edit-table.component.html',
  styleUrls: ['./edit-table.component.scss']
})
export class EditTableComponent implements OnInit {
  isDisabled = false;
  table: Table;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) { }

  ngOnInit() {
    this.route.data.subscribe(
      ( data: Data) => {
        this.table = data['table'];

        if (this.table === null || this.table === undefined) {
          this.toastr.errorToastr('Table is not found', 'Error');
          this.router.navigate(['admin/tables']);
        }
      }
    );
  }


  editTable(form: NgForm) {
    this.isDisabled = true;
    const tableName = form.value.name;

    if (tableName !== this.table.Name) {
      this.tableDataStorageService.editTable(
        new Table(
          this.table.Id,
          tableName,
          this.table.CurrentState,
          []
        )
      ).subscribe(
          (data: any) => {

            if (data.StatusText !== 'Success') {
              this.isDisabled = false;
              this.toastr.errorToastr(data.StatusText, 'Error');
              return;
            }

            this.toastr.successToastr('Information is updated', 'Success');
            this.router.navigate(['admin/tables', this.table.Id]);

          });
    } else {
      this.toastr.successToastr('Information is updated', 'Success');
      this.router.navigate(['admin/tables']);
    }
  }
}
