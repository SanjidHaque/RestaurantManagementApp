import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {InventoryHistoryModel} from '../../../shared/inventory-history.model';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../shared/inventory.model';
import { Uuid } from 'ng2-uuid';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {

  id: string;
  name = '';
  price: number;
  quantity: number;
  unit: string;
  inventoryList: Inventory[] = [];
  subscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
        }
      );

  }

  ngOnInit() {
    this.route.data.
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
        this.unit = this.inventoryList[i].Unit;
        this.name = this.inventoryList[i].Name;
      }
    }
  }

  onUpdateItem(form: NgForm) {
    const inventoryId = this.id;
    const updateHistoryId = this.uuid.v1();
    const quantity = form.value.quantity;
    const time = new Date().toLocaleString();
    const updateHistory =
      new InventoryHistoryModel(updateHistoryId, inventoryId, quantity, time, this.unit);
    for (let i = 0; i < this._ourOfferService.inventory.length; i++) {
      if ( this._ourOfferService.inventory[i].Id === this.id ) {
        this._ourOfferService.inventory[i].InventoryHistory.push(updateHistory);
        this._ourOfferService.inventory[i].RemainingQuantity  =
          Number.parseInt( this._ourOfferService.inventory[i].RemainingQuantity.toString())
          + Number.parseInt(quantity.toString());
      }
    }
    this._dataStorageService.updateInventoryHistory(updateHistory);
    form.reset();
    this.router.navigate(['admin/inventory/list-details', inventoryId]);
  }

  onCancel() {
    this.router.navigate(['admin/inventory/list-view']);
  }
}
