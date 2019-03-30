import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Inventory} from '../../../../models/inventory.model';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {InventoryDataStorageService} from '../../../../services/inventory-data-storage.service';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {

  isDisabled = false;

  inventoryId: number;
  inventory: Inventory;
  inventories: Inventory[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private inventoryDataStorageService: InventoryDataStorageService ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = +params['inventoryId'];
        }
      );

  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.inventories = data['inventories'];
        this.inventory = this.inventories.find( x => x.Id === this.inventoryId);

        if (this.inventory === undefined) {
          window.alert('Item not found!');
          this.router.navigate(['admin/inventories']);
        }
      }
    );
  }


  onUpdateInventoryItem(form: NgForm) {
    this.isDisabled = true;
    const inventoryId = this.inventoryId;
    const inventoryHistoryId = null;
    const buyingQuantity = form.value.quantity;
    const buyingPrice = form.value.price;
    const buyingTime = new Date().toLocaleString();
    const updateHistory = new InventoryHistory(
        inventoryHistoryId,
        inventoryId,
        buyingQuantity,
        buyingTime,
        buyingPrice
    );

    this.inventoryDataStorageService.updateInventoryHistory(updateHistory).
    subscribe(
      (data: any) => {
        form.reset();
        this.router.navigate(['admin/inventories/', this.inventoryId]);
      }
    );
  }


}
