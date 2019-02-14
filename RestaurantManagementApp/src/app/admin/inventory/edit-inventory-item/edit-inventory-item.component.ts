import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';
import {Inventory} from '../../../models/inventory.model';
import {NgForm} from '@angular/forms';
import {DataStorageService} from '../../../services/data-storage.service';
import {InventoryHistoryModel} from '../../../models/inventory-history.model';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
   id: string;
   name = '';
   currentPrice: number;
   quantity: number;
   unit: string;
   inventoryHistory: InventoryHistoryModel[] = [];
  inventoryList: Inventory[] = [];
  subscription: Subscription;
  isDisabled = false;

  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService ) {
    this._route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
        }
      );
  }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: Inventory[]) => {
        this._ourOfferService.inventory = data['inventories'];
      }
    );
    this.inventoryList = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventoryList = inventories;
        }
      );
    for (let i = 0; i < this.inventoryList.length; i++) {
      if ( this.inventoryList[i].Id === this.id ) {

        this.name = this.inventoryList[i].Name;
        this.currentPrice = this.inventoryList[i].AveragePrice;
        this.unit = this.inventoryList[i].Unit;
        this.inventoryHistory = this.inventoryList[i].InventoryHistoryModel;
      }
    }
  }

  onEditItem(form: NgForm) {
    this.isDisabled = true;
    const id = this.id;
    const name = form.value.name;
    const price = form.value.currentPrice;
    const unit = form.value.unit;
    const editedInventoryItem = new Inventory(this.id, name, 0, this.quantity,
      unit, price, this.inventoryHistory);

    this._dataStorageService.editInventoryItem(editedInventoryItem).
    subscribe(
      (data: any) => {

        this._ourOfferService.updateInventoryList(this.id, editedInventoryItem);
        form.reset();
        this.router.navigate(['admin/inventory/list-details', this.id]);
      }
    );
  }

  onCancel() {
    this.router.navigate(['admin/inventory/list-details', this.id]);
  }
}
