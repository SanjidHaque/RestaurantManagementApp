import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Inventory} from '../../../../models/inventory.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {InventoryHistory} from '../../../../models/inventory-history.model';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {

  id: number;
  name = '';
  price: number;
  quantity: number;
  unit: string;
  inventoryList: Inventory[] = [];
  subscription: Subscription;
  isDisabled = false;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private pointOfSaleService: PointOfSaleService,
              private dataStorageService: DataStorageService ) {
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
        this.unit = this.inventoryList[i].Unit;
        this.name = this.inventoryList[i].Name;
      }
    }
  }

  onUpdateItem(form: NgForm) {
    this.isDisabled = true;
    const inventoryId = this.id;
    const updateHistoryId = null;
    const quantity = form.value.quantity;
    const currentPrice = form.value.currentPrice;
    const time = new Date().toLocaleString();
    const updateHistory =
      new InventoryHistory(
        updateHistoryId,
        inventoryId,
        quantity,
        time,
        currentPrice);
    for (let i = 0; i < this.pointOfSaleService.inventories.length; i++) {
      if ( this.pointOfSaleService.inventories[i].Id === this.id ) {
        this.pointOfSaleService.inventories[i].InventoryHistoryModel.push(updateHistory);
        this.pointOfSaleService.inventories[i].RemainingQuantity  =
          Number.parseInt( this.pointOfSaleService.inventories[i].RemainingQuantity.toString())
          + Number.parseInt(quantity.toString());
      }
    }
    this.dataStorageService.updateInventoryHistory(updateHistory).
    subscribe(
      (data: any) => {
        form.reset();
        this.router.navigate(['admin/inventories/list-details', inventoryId]);
      }
    );
  }

  onCancel() {
    this.router.navigate(['admin/inventories/list-view']);
  }
}
