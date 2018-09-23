import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {Table} from '../../../shared/table.model';

@Component({
  selector: 'app-add-new-table',
  templateUrl: './add-new-table.component.html',
  styleUrls: ['./add-new-table.component.scss']
})
export class AddNewTableComponent implements OnInit {

  constructor(private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) { }

  ngOnInit() {
  }

  onAddNewTable(form: NgForm) {
    const id = this.uuid.v1();
    const name = form.value.name;
    const newTable = new Table(id, name);
    this._ourOfferService.addToTableList(newTable);
    this._dataStorageService.addNewTable(newTable).subscribe();
    form.controls['name'].reset();
  }

  onCancel() {
    this.router.navigate(['admin/tables']);
  }
}
