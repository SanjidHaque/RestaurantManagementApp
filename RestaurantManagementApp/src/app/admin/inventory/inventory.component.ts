import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Inventory} from '../../shared/inventory.model';
import {Http} from '@angular/http';
import {DataStorageService} from '../../shared/data-storage.service';
import {Subscription} from 'rxjs/Subscription';
import {OurOffersService} from '../../our-offers/our-offers.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  public inventories: Inventory[] ;
  subscription: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) { }

  ngOnInit() {
     this._dataStorageService.getInventories()
      .subscribe(
        (inventories: Inventory[]) => {
          this._ourOfferService.inventory = inventories;
        }
      );
    this.inventories = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
  }

  AddNewItem() {
    this.router.navigate(['admin/inventory/add-new-inventory']);
 }

  editItem(inventory: Inventory) {
    const id = inventory.Id;
    this.router.navigate(['admin/inventory/edit-inventory-item', id ]);
 }

 deleteItem(inventory: Inventory, index: number) {
   this._dataStorageService.deleteInventoryItem(inventory);
   this.inventories.splice(index, 1);
   this._ourOfferService.inventory.splice(index, 1);
 }

}
