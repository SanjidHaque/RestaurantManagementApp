import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {Inventory} from '../../../shared/inventory.model';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.scss']
})
export class AddNewInventoryComponent implements OnInit {
  uuidCodeOne = '';
  unit : number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
   // this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
  }

  onAddNewItem(form: NgForm) {
      const id = this.uuid.v1();
      // const id = this.uuidCodeOne;
      const name = form.value.name;
      const quantity = form.value.quantity;
      if( form.value.unit === 'Kg' || form.value.unit === 'kg' ) {
        this.unit = 1;
      }
      const price = form.value.price;
      const newItem = new Inventory(id, name, quantity, this.unit, price);
      this._ourOfferService.addToInventoryList(newItem);
      this._dataStorageService.addNewInventoryItem(newItem);
      form.reset();
  }



  onCancel() {
    this.router.navigate(['admin/inventory']);

  }
}
