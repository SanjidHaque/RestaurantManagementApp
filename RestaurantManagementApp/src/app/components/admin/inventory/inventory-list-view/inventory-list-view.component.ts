import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Inventory} from '../../../../models/inventory.model';

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
    this.router.navigate(['admin/inventories/list-details', inventoryId]);
  }
}
