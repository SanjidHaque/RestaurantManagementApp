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
              private route: ActivatedRoute,
              private ourOffersService: OurOffersService,
             ) {}

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
    this.totalProducts = this.ourOffersService.inventory.length;
  }
  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/grid-details', inventoryId]);
  }
}
