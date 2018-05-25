import { Component, OnInit, DoCheck } from '@angular/core';
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
export class InventoryListViewComponent implements OnInit, DoCheck {

  public inventories: Inventory[] = [] ;
  subscription: Subscription;
  totalProducts = 0;


  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              ) {

  }

  ngOnInit() {
    this._route.data.
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
    this.totalProducts = this._ourOfferService.inventory.length;
  }

  ngDoCheck() {
   // this.totalProducts = this._ourOfferService.inventory.length;
  }
  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/list-details', inventoryId]);
  }
}
