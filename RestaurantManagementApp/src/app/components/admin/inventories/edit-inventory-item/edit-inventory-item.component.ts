import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {Inventory} from '../../../../models/inventory.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {InventoryDataStorageService} from '../../../../services/inventory-data-storage.service';

@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
   id: number;
   name = '';
   currentPrice: number;
   quantity: number;
   unit: string;
   inventoryHistory: InventoryHistory[] = [];
   inventoryList: Inventory[] = [];
   subscription: Subscription;
   isDisabled = false;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private pointOfSaleService: PointOfSaleService,
              private inventoryDataStorageService: InventoryDataStorageService ) {
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
        this.pointOfSaleService.inventories = data['inventories'];
      }
    );
    this.inventoryList = this.pointOfSaleService.inventories;
    this.subscription = this.pointOfSaleService.inventoriesChanged
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
        this.inventoryHistory = this.inventoryList[i].InventoryHistory;
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

    this.inventoryDataStorageService.editInventoryItem(editedInventoryItem).
    subscribe(
      (data: any) => {

        this.pointOfSaleService.updateInventoryList(this.id, editedInventoryItem);
        form.reset();
        this.router.navigate(['admin/inventories/food-item-details', this.id]);
      }
    );
  }

  onCancel() {
    this.router.navigate(['admin/inventories/food-item-details', this.id]);
  }
}
