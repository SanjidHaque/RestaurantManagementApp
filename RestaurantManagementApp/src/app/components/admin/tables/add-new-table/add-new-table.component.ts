import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {Table} from '../../../../models/table.model';
import {TableDataStorageService} from '../../../../services/data-storage/table-data-storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-add-new-table',
  templateUrl: './add-new-table.component.html',
  styleUrls: ['./add-new-table.component.scss']
})
export class AddNewTableComponent {

  isDisabled = false;
  constructor(private router: Router,
              private toastr: ToastrManager,
              private tableDataStorageService: TableDataStorageService) {}



  addNewTable(form: NgForm) {
    this.isDisabled = true;
    const id = null;
    const tableName = form.value.name;
    this.tableDataStorageService.addNewTable(new Table(id, tableName, 'Empty'))
      .subscribe(
        (data: any) => {
          this.toastr.successToastr('Added to shop', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          form.reset();
          this.router.navigate(['admin/tables']);
        }
    );
  }
}
