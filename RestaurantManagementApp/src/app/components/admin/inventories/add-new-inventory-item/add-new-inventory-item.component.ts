import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
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

export class AddNewInventoryItemComponent {
  isDisabled = false;

  constructor(private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService) {
  }

  addNewInventoryItem(form: NgForm) {
      this.isDisabled = true;
      const inventoryId = null;
      const inventoryItemName = form.value.name;
      const unit = form.value.unit;
      const buyingTime = new Date().toLocaleString();

      const inventory = new Inventory(
         inventoryId,
         inventoryItemName,
        0,
        0,
         unit,
        0,
        [],
         buyingTime
      );

       this.inventoryDataStorageService.addNewInventory(inventory)
         .subscribe(
         (data: any) => {
           if (data === 'Duplicate') {
             this.toastr.errorToastr('Item already exists', 'Error', {
               toastLife: 10000,
               newestOnTop: true,
               showCloseButton: true
             });
             this.isDisabled = false;
             return;
           }

           this.toastr.successToastr('Added to inventory', 'Success', {
             toastLife: 10000,
             newestOnTop: true,
             showCloseButton: true
           });
           this.router.navigate(['admin/inventories']);
         }
       );
  }

}
