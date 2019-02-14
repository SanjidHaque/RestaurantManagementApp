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
  public tables: Table[] ;
  tableId: string;
  tableName = '';
  subscription: Subscription;
  isDisabled = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.tableId = params['id'];
        }
      );
  }

  ngOnInit() {
    this.tables = this._ourOfferService.table;
    this.subscription = this._ourOfferService.tableChanged
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
    const ifExist = this._ourOfferService.editTable(editedTable);
    if (ifExist) {
      this._dataStorageService.editTable(editedTable)
        .subscribe(
          (data: any) => {
            form.reset();
            this.router.navigate(['admin/tables']);
          }
        );
    }

  }

  onCancel() {
    this.router.navigate(['admin/tables']);
  }
}
