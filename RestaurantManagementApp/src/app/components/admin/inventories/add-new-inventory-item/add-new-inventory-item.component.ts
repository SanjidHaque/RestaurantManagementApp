import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { ToastrManager } from 'ng6-toastr-notifications';

import {InventoryHistory} from '../../../../models/inventory-history.model';
import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
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
    this.isDisabled = true;
      const inventoryId = null;
      const updateHistoryId = null;
      const inventoryItemName = form.value.name;
      const buyingQuantity = form.value.quantity;
      const buyingPrice = form.value.price;
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
