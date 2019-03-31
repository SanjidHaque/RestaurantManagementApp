import { Component } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {TableDataStorageService} from '../../../../services/table-data-storage.service';
import {Table} from '../../../../models/table.model';

@Component({
  selector: 'app-add-new-table',
  templateUrl: './add-new-table.component.html',
  styleUrls: ['./add-new-table.component.scss']
})
export class AddNewTableComponent {

  isDisabled = false;
  constructor(private router: Router,
              private pointOfSaleService: PointOfSaleService,
              private dataStorageService: TableDataStorageService) {}



  onAddNewTable(form: NgForm) {
    this.isDisabled = true;
    const id = null;
    const name = form.value.name;
    const newTable = new Table(id, name);
    this.dataStorageService.addNewTable(newTable)
      .subscribe(
        (tableId: number) => {
          newTable.Id = tableId;
          this.pointOfSaleService.addNewTable(newTable);
          form.controls['name'].reset();
          this.router.navigate(['admin/tables']);
        }
    );
  }
}
