import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Component, OnInit} from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory-item.component.html',
  styleUrls: ['./add-new-inventory-item.component.scss']
})

export class AddNewInventoryItemComponent implements OnInit {
  isDisabled = false;

  constructor(private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService) {
  }

  ngOnInit() {
  }

  addNewInventoryItem(form: NgForm) {
    const buyingPrice = form.value.price;
    if (!this.adminService.checkPricingConditions(buyingPrice)) {
      return;
    }

      this.isDisabled = true;
      const inventoryId = null;
      const updateHistoryId = null;
      const inventoryItemName = form.value.name;
      const buyingQuantity = form.value.quantity;
      const unit = form.value.unit;
      const buyingTime = new Date().toLocaleString();



      const inventoryHistories: InventoryHistory[] = [new InventoryHistory(
      updateHistoryId,
      inventoryId,
      buyingQuantity,
      buyingTime,
      buyingPrice
    )];

      const inventory = new Inventory(
        inventoryId,
        inventoryItemName,
        0,
        buyingQuantity,
        unit,
        buyingPrice,
        inventoryHistories,
        buyingTime
      );

       this.inventoryDataStorageService.addNewInventoryItem(inventory).
       subscribe(
         (data: any) => {
           this.toastr.successToastr('Added to inventory!', 'Success', {
             toastLife: 10000,
             newestOnTop: true,
             showCloseButton: true
           });
           form.reset();
           this.router.navigate(['admin/inventories']);
         }
       );
  }

}
