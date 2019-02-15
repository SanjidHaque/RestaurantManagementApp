import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../../services/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../../services/our-offers.service';
import {Inventory} from '../../../../models/inventory.model';
import {Subscription} from 'rxjs';
import {InventoryHistoryModel} from '../../../../models/inventory-history.model';

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
  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private ourOffersService: OurOffersService,
              ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = params['id'];
        }
      );
  }
  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.ourOffersService.inventory = data['inventories'];
      }
    );
    this.inventoryList = this.ourOffersService.inventory;
    this.subscription = this.ourOffersService.inventoryChanged
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
    this.dataStorageService.deleteInventoryItem(this.inventory).
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
