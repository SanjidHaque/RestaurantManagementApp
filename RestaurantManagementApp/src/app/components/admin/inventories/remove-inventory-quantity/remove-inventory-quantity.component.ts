import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-remove-inventory-quantity',
  templateUrl: './remove-inventory-quantity.component.html',
  styleUrls: ['./remove-inventory-quantity.component.scss']
})
export class RemoveInventoryQuantityComponent implements OnInit {
  isDisabled = false;

  inventoryId: number;
  inventory: Inventory;
  inventories: Inventory[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.inventoryId = +params['inventory-id'];
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


  removeInventoryQuantity(form: NgForm) {
    const removalQuantity = form.value.quantity;
    if (!this.adminService.checkPricingConditions(removalQuantity)) {
      return;
    }
    this.isDisabled = true;

    this.inventoryDataStorageService.removeInventoryQuantity(
      new Inventory(
        this.inventoryId,
        null,
        null,
        removalQuantity,
        null,
        null,
        [],
        null
      )
    ).subscribe(
      (data: any) => {
        if (data === 'Success') {
          this.toastr.successToastr('Quantity is removed', 'Success', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          form.reset();
          this.router.navigate(['admin/inventories/', this.inventoryId]);
        } else {
          this.isDisabled = false;
          this.toastr.errorToastr('Too big quantity', 'Error', {
            toastTimeout: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
        }
      });
  }
}
