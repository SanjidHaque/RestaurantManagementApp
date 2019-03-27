import { Component, OnInit } from '@angular/core';
import {Inventory} from '../../../models/inventory.model';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-inventory-list-view',
  templateUrl: './inventory-list-view.component.html',
  styleUrls: ['./inventory-list-view.component.scss']
})
export class InventoryListViewComponent implements OnInit {

  inventories: Inventory[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router
              ) {}

  ngOnInit() {
    this.route.data.
    subscribe(
      (data: Inventory[]) => {
        this.inventories = data['inventories'];
      });
  }

  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventory/list-details', inventoryId]);
  }
}
