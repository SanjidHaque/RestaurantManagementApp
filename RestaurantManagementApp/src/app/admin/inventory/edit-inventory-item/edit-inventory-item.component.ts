import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Inventory} from '../../../shared/inventory.model';
import {NgForm} from '@angular/forms';
import {DataStorageService} from '../../../shared/data-storage.service';
import {InventoryHistoryModel} from '../../../shared/inventory-history.model';

@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
   id: string;
   name = '';
   price: number;
   quantity: number;
   unit: string;
   inventoryHistory: InventoryHistoryModel[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          for (let i = 0; i < this._ourOfferService.inventory.length; i++) {
            if ( this._ourOfferService.inventory[i].Id === this.id ) {

               this.name = this._ourOfferService.inventory[i].Name;
               this.price = this._ourOfferService.inventory[i].Price;
               this.unit = this._ourOfferService.inventory[i].Unit;
               this.inventoryHistory = this._ourOfferService.inventory[i].InventoryHistory;
            }
          }
        }
      );
  }

  onEditItem(form: NgForm) {
    const id = this.id;
    const name = form.value.name;
    const price = form.value.price;
    const unit = form.value.unit;
    const editedInventoryItem = new Inventory(this.id, name, 0, this.quantity,
      unit, price, this.inventoryHistory);
    this._ourOfferService.updateInventoryList(this.id, editedInventoryItem);
    this._dataStorageService.editInventoryItem(editedInventoryItem);
    form.reset();
    this.router.navigate(['admin/inventory/list-details', this.id]);
  }

  onCancel() {
    this.router.navigate(['admin/inventory/list-details', this.id]);
  }
}
