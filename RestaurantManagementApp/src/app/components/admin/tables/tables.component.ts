import {Component, DoCheck, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {Table} from '../../../models/table.model';
import {TableDataStorageService} from '../../../services/data-storage/table-data-storage.service';
import {PointOfSaleService} from '../../../services/shared/point-of-sale.service';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent {

  tables: Table[] ;
  subscription: Subscription;
  totalTable = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: TableDataStorageService) { }

  // ngOnInit() {
  //   this.route.data.
  //   subscribe(
  //     ( data: Table[]) => {
  //       this.pointOfSaleService.tables = data['tables'];
  //     }
  //   );
  //   this.tables = this.pointOfSaleService.tables;
  //   this.subscription = this.pointOfSaleService.tablesChanged
  //     .subscribe(
  //       (tables: Table[]) => {
  //         this.tables = tables;
  //       }
  //     );
  //   this.totalTable = this.tables.length;
  // }
  //
  addNewTable() {
    this.router.navigate(['admin/tables/add-new-tables']);
  }

  editTable(table: Table) {
    this.router.navigate(['admin/tables/edit-tables', table.Id]);
  }

  deleteTable(table: Table, index: number) {
    const dialog = confirm('Delete this tables?\n' +
      'You will lose any kind of data associated with the current tables!');
    if (dialog === true) {
      this.confirmEvent(table, index);
    }
  }

  confirmEvent(table: Table, index: number) {
    this.dataStorageService.deleteTable(1).
    subscribe(
      (data: any) => {
        this.tables.splice(index, 1);
      });

  }
}
