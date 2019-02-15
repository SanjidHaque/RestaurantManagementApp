import { Component, OnInit, DoCheck } from '@angular/core';
import {Inventory} from '../../../models/inventory.model';
import {OurOffersService} from '../../../services/our-offers.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-inventory-list-view',
  templateUrl: './inventory-list-view.component.html',
  styleUrls: ['./inventory-list-view.component.scss']
})
export class InventoryListViewComponent implements OnInit, DoCheck {

  public inventories: Inventory[] = [] ;
  subscription: Subscription;
  totalProducts = 0;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private ourOffersService: OurOffersService,
              ) {

  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.ourOffersService.inventory = data['inventories'];
      }
    );
    this.inventories = this.ourOffersService.inventory;
    this.subscription = this.ourOffersService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.totalProducts = this.ourOffersService.inventory.length;
  }

  ngDoCheck() {
   // this.totalProducts = this.ourOffersService.inventory.length;
  }
  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/list-details', inventoryId]);
  }
}
