import { Component, OnInit } from '@angular/core';
import {Inventory} from '../../../shared/inventory.model';
import {Http} from '@angular/http';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-inventory-list-view',
  templateUrl: './inventory-list-view.component.html',
  styleUrls: ['./inventory-list-view.component.scss']
})
export class InventoryListViewComponent implements OnInit {

  public inventories: Inventory[] ;
  subscription: Subscription;
  totalProducts = 0;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              ) {

  }

  ngOnInit() {
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
    console.log(this._ourOfferService.inventory);
    this.totalProducts = this.inventories.length;
  }
  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/list-details', inventoryId]);
  }
}
