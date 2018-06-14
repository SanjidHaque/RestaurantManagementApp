import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {Inventory} from '../../../../shared/inventory.model';
import {Subscription} from 'rxjs/Subscription';
import {InventoryHistoryModel} from '../../../../shared/inventory-history.model';

@Component({
  selector: 'app-inventory-list-details',
  templateUrl: './inventory-list-details.component.html',
  styleUrls: ['./inventory-list-details.component.scss']
})
export class InventoryListDetailsComponent implements OnInit {

 inventoryId: string;
 inventory: Inventory;
 inventoryList: Inventory[] = [];
 inventoryHistory: InventoryHistoryModel[] = [];
 subscription: Subscription;
 index: number;
  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              ) {
    this._route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = params['id'];
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
      if (this.inventoryList[i].Id === this.inventoryId) {
        this.inventory = this.inventoryList[i];
        this.inventoryHistory = this.inventoryList[i].InventoryHistoryModel;
        this.index = i;
      }
    }
  }


  goBack() {
    this.router.navigate(['admin/inventory/list-view']);
  }


  confirmEvent() {
    this._dataStorageService.deleteInventoryItem(this.inventory).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/inventory/list-view']);
      }
    );
  }
  edit(inventory: Inventory) {
    this.router.navigate(['admin/inventory/edit-inventory-item', inventory.Id]);
  }
  update(inventory: Inventory) {
    this.router.navigate(['admin/inventory/update-inventory-item', inventory.Id]);
  }

  deleteInventoryItem() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog) {
      this.confirmEvent();
    }
  }
}
