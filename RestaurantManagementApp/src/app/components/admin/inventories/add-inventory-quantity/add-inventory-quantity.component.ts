import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-add-inventory-quantity',
  templateUrl: './add-inventory-quantity.component.html',
  styleUrls: ['./add-inventory-quantity.component.scss']
})
export class AddInventoryQuantityComponent implements OnInit {
  isDisabled = false;
  inventory: Inventory;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService ) { }

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


  addInventoryQuantity(form: NgForm) {
    const price = form.value.price;
    const quantity = form.value.quantity;

    if (!this.adminService.checkNumericConditions(price, 'inventory') ||
      !this.adminService.checkNumericConditions(quantity, 'inventory') ) {
      return;
    }

    this.isDisabled = true;
    const inventoryId = this.inventory.Id;
    const inventoryHistoryId = null;
    const dateTime = new Date().toLocaleString();

    const inventoryHistory = new InventoryHistory(
        inventoryHistoryId,
        inventoryId,
        quantity,
        dateTime,
        price,
      'Add',
      ''
    );

    this.inventoryDataStorageService.addInventoryQuantity(inventoryHistory)
      .subscribe((data: any) => {
        this.toastr.successToastr('Information is updated', 'Success', {
          toastTimeout: 10000,
          newestOnTop: true,
          showCloseButton: true
        });
        form.reset();
        this.router.navigate(['admin/inventories/', this.inventory.Id]);
      }
    );
  }


}
