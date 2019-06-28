import { Component, OnInit } from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-inventory-details',
  templateUrl: './inventory-details.component.html',
  styleUrls: ['./inventory-details.component.scss']
})
export class InventoryDetailsComponent implements OnInit {

  inventory: Inventory;
  pageNumber = 1;

  constructor(private router: Router,
             private route: ActivatedRoute,
             private toastr: ToastrManager,
             private inventoryDataStorageService: InventoryDataStorageService) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      (data: Data) => {
        this.inventory = data['inventory'];

        if (this.inventory === undefined || this.inventory === null) {
          this.toastr.errorToastr('Item not found', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
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
    this.inventoryDataStorageService.deleteInventory(this.inventory.Id).
    subscribe(
      (data: any) => {

        if (data === 'Failed') {
          this.toastr.errorToastr('This item cannot be deleted for reporting purpose',
            'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          return;
        }

        this.toastr.successToastr('Removed from shop', 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        this.router.navigate(['admin/inventories']);
      }
    );
  }

}
