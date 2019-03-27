import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../services/data-storage.service';
import {OurOffersService} from '../../../services/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {InventoryHistory} from '../../../models/inventory-history.model';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../models/inventory.model';
import {Subscription} from 'rxjs';
import {UUID} from 'angular2-uuid';

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
              private ourOffersService: OurOffersService,
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
    for (let i = 0; i < this.ourOffersService.inventories.length; i++) {
      if ( this.ourOffersService.inventories[i].Id === this.id ) {
        this.ourOffersService.inventories[i].InventoryHistoryModel.push(updateHistory);
        this.ourOffersService.inventories[i].RemainingQuantity  =
          Number.parseInt( this.ourOffersService.inventories[i].RemainingQuantity.toString())
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
