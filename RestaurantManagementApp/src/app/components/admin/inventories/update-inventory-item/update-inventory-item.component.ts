import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {
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


  onUpdateInventoryItem(form: NgForm) {
    const buyingPrice = form.value.price;
    const buyingQuantity = form.value.quantity;

    if (!this.adminService.checkPricingConditions(buyingPrice) ||
      !this.adminService.checkPricingConditions(buyingQuantity) ) {
      return;
    }

    this.isDisabled = true;
    const inventoryId = this.inventory.Id;
    const inventoryHistoryId = null;


    const buyingTime = new Date().toLocaleString();
    const updateHistory = new InventoryHistory(
        inventoryHistoryId,
        inventoryId,
        buyingQuantity,
        buyingTime,
        buyingPrice
    );

    this.inventoryDataStorageService.updateInventoryHistory(updateHistory).
    subscribe(
      (data: any) => {
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
