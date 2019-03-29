import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Inventory} from '../../../../../models/inventory.model';
import {InventoryHistory} from '../../../../../models/inventory-history.model';
import {DataStorageService} from '../../../../../services/data-storage.service';
import {PointOfSaleService} from '../../../../../services/point-of-sale.service';

@Component({
  selector: 'app-inventory-list-details',
  templateUrl: './inventory-list-details.component.html',
  styleUrls: ['./inventory-list-details.component.scss']
})
export class InventoryListDetailsComponent implements OnInit {

 inventoryId: number;
 inventory: Inventory;
 inventories: Inventory[] = [];
 inventoryHistories: InventoryHistory[] = [];
 subscription: Subscription;
 index: number;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private pointOfSaleService: PointOfSaleService,
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
        this.pointOfSaleService.inventories = data['inventories'];
      }
    );
    this.inventories = this.pointOfSaleService.inventories;
    this.subscription = this.pointOfSaleService.inventoriesChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );

    for (let i = 0; i < this.inventories.length; i++) {
      if (this.inventories[i].Id === this.inventoryId) {
        this.inventory = this.inventories[i];
        this.inventoryHistories = this.inventories[i].InventoryHistoryModel;
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
