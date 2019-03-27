import {Component, DoCheck, OnInit} from '@angular/core';
import {Table} from '../../../models/table.model';
import {Subscription} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';
import {DataStorageService} from '../../../services/data-storage.service';
import {NgForm} from '@angular/forms';

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
              private ourOffersService: OurOffersService,
              private dataStorageService: DataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.tableId = +params['id'];
        }
      );
  }

  ngOnInit() {
    this.tables = this.ourOffersService.tables;
    this.subscription = this.ourOffersService.tablesChanged
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
          this.tableId = params['id'];
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
    const ifExist = this.ourOffersService.editTable(editedTable);
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
