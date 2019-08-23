import {NgForm} from '@angular/forms';
import {Router} from '@angular/router';
import {Component} from '@angular/core';
import { ToastrManager } from 'ng6-toastr-notifications';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
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

      const inventory = new Inventory(
         inventoryId,
         inventoryItemName,
        0,
        0,
         unit,
        0,
        []
      );

       this.inventoryDataStorageService.addNewInventory(inventory)
         .subscribe(
         (data: any) => {
           if (data.StatusText !== 'Success') {
             this.isDisabled = false;
             this.toastr.errorToastr(data.StatusText, 'Error');
             return;
           }

           this.toastr.successToastr('Added to inventory', 'Success');
           this.router.navigate(['admin/inventories']);
         }
       );
  }

}
