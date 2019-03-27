import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../../services/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../../services/our-offers.service';
import {Inventory} from '../../../../models/inventory.model';
import {Subscription} from 'rxjs';
import {InventoryHistory} from '../../../../models/inventory-history.model';

@Component({
  selector: 'app-inventory-list-details',
  templateUrl: './inventory-list-details.component.html',
  styleUrls: ['./inventory-list-details.component.scss']
})
export class InventoryListDetailsComponent implements OnInit {

 inventoryId: number;
 inventory: Inventory;
 inventoryList: Inventory[] = [];
 inventoryHistory: InventoryHistory[] = [];
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
        this.ourOffersService.inventories = data['inventories'];
      }
    );
    this.inventoryList = this.ourOffersService.inventories;
    this.subscription = this.ourOffersService.inventoriesChanged
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
    this.router.navigate(['admin/inventories/list-view']);
  }


  confirmEvent() {
    this.dataStorageService.deleteInventoryItem(this.inventory).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/inventories/list-view']);
      }
    );
  }
  edit(inventory: Inventory) {
    this.router.navigate(['admin/inventories/edit-inventories-item', inventory.Id]);
  }
  update(inventory: Inventory) {
    this.router.navigate(['admin/inventories/update-inventories-item', inventory.Id]);
  }

  deleteInventoryItem() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog) {
      this.confirmEvent();
    }
  }
}
