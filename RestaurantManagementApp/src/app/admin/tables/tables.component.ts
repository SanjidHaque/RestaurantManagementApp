import {Component, DoCheck, OnInit} from '@angular/core';
import {Table} from '../../models/table.model';
import {OurOffersService} from '../../services/our-offers.service';
import {DataStorageService} from '../../services/data-storage.service';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tables',
  templateUrl: './tables.component.html',
  styleUrls: ['./tables.component.scss']
})
export class TablesComponent implements OnInit, DoCheck {

  public tables: Table[] ;
  subscription: Subscription;
  totalTable = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private ourOffersService: OurOffersService,
              ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Table[]) => {
        this.ourOffersService.table = data['tables'];
      }
    );
    this.tables = this.ourOffersService.table;
    this.subscription = this.ourOffersService.tableChanged
      .subscribe(
        (tables: Table[]) => {
          this.tables = tables;
        }
      );
    this.totalTable = this.tables.length;
  }
  ngDoCheck() {
    this.totalTable = this.tables.length;
  }
  addNewTable() {
    this.router.navigate(['admin/tables/add-new-table']);
  }

  editTable(table: Table) {
    this.router.navigate(['admin/tables/edit-table', table.Id]);
  }
  deleteTable(table: Table, index: number) {
    const dialog = confirm('Delete this table?\n' +
      'You will lose any kind of data associated with the current table!');
    if (dialog === true) {
      this.confirmEvent(table, index);
    }
  }

  confirmEvent(table: Table, index: number) {
    this.dataStorageService.deleteTable(table).subscribe();
    this.tables.splice(index, 1);
    this.ourOffersService.table.splice(index, 1);
  }
}
