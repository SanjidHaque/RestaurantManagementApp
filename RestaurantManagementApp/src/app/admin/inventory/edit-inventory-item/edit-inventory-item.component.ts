import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Inventory} from '../../../shared/inventory.model';
import {NgForm} from '@angular/forms';
import {DataStorageService} from '../../../shared/data-storage.service';

@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
   id: string;
   name = '';
   price: number
   quantity: number;
   unit: number;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          for (let i = 0; i< this._ourOfferService.inventory.length; i++) {
            if ( this._ourOfferService.inventory[i].Id === this.id ) {

               this.name = this._ourOfferService.inventory[i].Name;
               this.price = this._ourOfferService.inventory[i].Price;
               this.quantity = this._ourOfferService.inventory[i].Quantity;

            }
          }
        }
      );
  }

  onEditItem(form: NgForm) {
    const id = this.id;
    const name = form.value.name;
    const quantity = form.value.quantity;
    if ( form.value.unit === 'Kilogram' ) {
      this.unit = 1;
    }
    if ( form.value.unit === 'Litre') {
      this.unit = 2;
    }
    if ( form.value.unit === 'Piece') {
      this.unit = 3;
    }
    if ( form.value.unit === 'Bottle') {
      this.unit = 4;
    }
    const price = form.value.price;

    /*for (let i = 0; i< this._ourOfferService.inventory.length; i++) {
      if ( this._ourOfferService.inventory[i].Id === this.id ) {

        this._ourOfferService.inventory[i].Name = name;
        this._ourOfferService.inventory[i].Price = price;
        this._ourOfferService.inventory[i].Quantity = this.quantity;
        this._ourOfferService.inventory[i].Unit = this.unit;
      }*/
   // }

    const editedInventoryItem = new Inventory(this.id, name, quantity, this.unit, price);
    this._ourOfferService.updateInventoryList(this.id, editedInventoryItem);
   this._dataStorageService.editInventoryItem(editedInventoryItem);
  }

  onCancel() {
    this.router.navigate(['admin/inventory']);
  }
}
