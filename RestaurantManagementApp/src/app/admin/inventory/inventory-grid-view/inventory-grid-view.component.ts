import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {Inventory} from '../../../shared/inventory.model';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {Http} from '@angular/http';

@Component({
  selector: 'app-inventory-grid-view',
  templateUrl: './inventory-grid-view.component.html',
  styleUrls: ['./inventory-grid-view.component.scss']
})
export class InventoryGridViewComponent implements OnInit {

  public inventories: Inventory[] ;
  subscription: Subscription;
  totalProducts = 0;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) {

  }

  ngOnInit() {
    /*this._dataStorageService.getInventories()
      .subscribe(
        (inventories: Inventory[]) => {
          this._ourOfferService.inventory = inventories;
        }
      );*/
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this._ourOfferService.inventory = data['inventories'];
      }
    );
    this.inventories = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.totalProducts = this.inventories.length;
  }
  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/grid-details', inventoryId]);
  }
}
