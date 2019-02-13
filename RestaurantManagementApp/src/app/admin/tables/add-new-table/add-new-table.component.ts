import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {Table} from '../../../shared/table.model';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-add-new-table',
  templateUrl: './add-new-table.component.html',
  styleUrls: ['./add-new-table.component.scss']
})
export class AddNewTableComponent implements OnInit {

  isDisabled = false;

  constructor(private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) { }

  ngOnInit() {
  }

  onAddNewTable(form: NgForm) {
    this.isDisabled = true;
    const id = UUID.UUID();
    const name = form.value.name;
    const newTable = new Table(id, name);
    this._ourOfferService.addToTableList(newTable);
    this._dataStorageService.addNewTable(newTable)
      .subscribe(
        (data: any) => {
          form.controls['name'].reset();
          this.router.navigate(['admin/tables']);
        }
    );

  }

  onCancel() {
    this.router.navigate(['admin/tables']);
  }
}
