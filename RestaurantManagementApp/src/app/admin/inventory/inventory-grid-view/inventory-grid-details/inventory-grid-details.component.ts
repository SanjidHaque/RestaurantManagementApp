import { Component, OnInit } from '@angular/core';
import {InventoryHistoryModel} from '../../../../shared/inventory-history.model';
import {Inventory} from '../../../../shared/inventory.model';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../../shared/data-storage.service';

@Component({
  selector: 'app-inventory-grid-details',
  templateUrl: './inventory-grid-details.component.html',
  styleUrls: ['./inventory-grid-details.component.scss']
})
export class InventoryGridDetailsComponent implements OnInit {

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
    this.router.navigate(['admin/inventory/grid-view']);
  }



  confirmEvent() {
    this._dataStorageService.deleteInventoryItem(this.inventory).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/inventory/grid-view']);
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
