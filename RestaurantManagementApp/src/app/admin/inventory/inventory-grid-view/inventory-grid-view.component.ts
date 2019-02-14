import {Component, DoCheck, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Inventory} from '../../../models/inventory.model';
import {OurOffersService} from '../../../services/our-offers.service';

@Component({
  selector: 'app-inventory-grid-view',
  templateUrl: './inventory-grid-view.component.html',
  styleUrls: ['./inventory-grid-view.component.scss']
})
export class InventoryGridViewComponent implements OnInit, DoCheck {

  public inventories: Inventory[] ;
  subscription: Subscription;
  totalProducts = 0;

  constructor(private router: Router,
              private _route: ActivatedRoute,
              private _ourOfferService: OurOffersService,
             ) {}

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
    this.totalProducts = this._ourOfferService.inventory.length;
  }
  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/grid-details', inventoryId]);
  }
}
