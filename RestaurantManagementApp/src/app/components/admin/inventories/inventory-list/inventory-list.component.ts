import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/admin.service';

@Component({
  selector: 'app-inventory-list',
  templateUrl: './inventory-list.component.html',
  styleUrls: ['./inventory-list.component.scss']
})
export class InventoryListComponent implements OnInit {

  inventories: Inventory[] = [];
  constructor(private router: Router,
              private adminService: AdminService) {}

  ngOnInit() {
    this.inventories = this.adminService.getAllInventoryItem();
    console.log(this.inventories);
  }

  viewDetails(inventory: Inventory) {
    const inventoryId =  inventory.Id;
    this.router.navigate(['admin/inventories/food-item-details', inventoryId]);
  }
}
