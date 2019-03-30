import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Subscription} from 'rxjs';
import {Inventory} from '../../../../models/inventory.model';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {InventoryDataStorageService} from '../../../../services/inventory-data-storage.service';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit {

 inventoryId: number;
 inventory: Inventory;
 inventories: Inventory[] = [];

 constructor(private route: ActivatedRoute,
             private router: Router,
             private inventoryDataStorageService: InventoryDataStorageService) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = +params['id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.inventories = data['inventories'];
        this.inventory = this.inventories.find( x => x.Id === this.inventoryId);
        if (this.inventory === undefined) {
          window.alert('Item not found!');
          this.router.navigate(['admin/inventories']);
        }
      }
    );
  }

  deleteInventoryItem() {
    const dialog = confirm('Delete this item?\n' +
      'You will lose any kind of data associated with the current item!');
    if (dialog) {
      this.confirmEvent();
    }
  }

  confirmEvent() {
    this.inventoryDataStorageService.deleteInventoryItem(this.inventoryId).
    subscribe(
      (data: any) => {
        this.router.navigate(['admin/inventories']);
      }
    );
  }

}
