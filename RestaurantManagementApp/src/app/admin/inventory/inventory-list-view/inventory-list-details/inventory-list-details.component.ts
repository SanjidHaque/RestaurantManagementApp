import { Component, OnInit } from '@angular/core';
import {Http} from '@angular/http';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {LocationStrategy} from '@angular/common';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Popup} from 'ng2-opd-popup';
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

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private popup: Popup,
              private _ourOfferService: OurOffersService,
              private _http: Http) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = params['id'];
        }
      );
  }
  ngOnInit() {

    this._dataStorageService.getInventories()
      .subscribe(
        (inventories: Inventory[]) => {
          this._ourOfferService.inventory = inventories;
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
        this.inventoryHistory = this.inventoryList[i].InventoryHistory;

      }
    }
  }


  goBack() {
    this.router.navigate(['admin/inventory/list-view']);
  }


  confirmEvent(index: number) {
    this._dataStorageService.deleteInventoryItem(this.inventory);
    this.inventoryList.splice(index, 1);
    this._ourOfferService.inventory.splice(index, 1);
    this.router.navigate(['admin/inventory/list-view']);
    this.popup.hide();
  }
  edit(inventory: Inventory) {
    this.router.navigate(['admin/inventory/edit-inventory-item', inventory.Id]);
  }
  update(inventory: Inventory) {
    this.router.navigate(['admin/inventory/update-inventory-item', inventory.Id]);
  }

  cancelEvent() {
    this.popup.hide();
  }
  deleteInventoryItem() {
    this.popup.options = {
      header: 'Delete This Item?',
      color: '#760000', // red, blue....
      widthProsentage: 50, // The with of the popou measured by browser width
      animationDuration: 1, // in seconds, 0 = no animation
      showButtons: true, // You can hide this in case you want to use custom buttons
      confirmBtnContent: 'Confirm', // The text on your confirm button
      cancleBtnContent: 'Cancel', // the text on your cancel button
      confirmBtnClass: 'btn btn-default', // your class for styling the confirm button
      cancleBtnClass: 'btn btn-default', // you class for styling the cancel button
      animation: 'bounceIn' // 'fadeInLeft', 'fadeInRight', 'fadeInUp', 'bounceIn','bounceInDown'
    };
    this.popup.show();
  }
}
