import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';


@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
  isDisabled = false;
  inventory: Inventory;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      (data: Data) => {
        this.inventory = data['inventory'];

        if (this.inventory === undefined || this.inventory === null) {
          this.toastr.errorToastr('Item not found', 'Error');
          this.router.navigate(['admin/inventories']);
        }
      }
    );
  }

  editInventoryItem(form: NgForm) {
    this.isDisabled = true;

    const editedInventory = new Inventory(
      1,
      form.value.name,
      null,
      null,
      form.value.unit,
      null,
      []
      );

      this.inventoryDataStorageService.editInventory(editedInventory)
        .subscribe((data: any) => {

          if (data.StatusText !== 'Success') {
            this.isDisabled = false;
            this.toastr.errorToastr(data.StatusText, 'Error');
            return;
          }

        this.toastr.successToastr('Information updated!', 'Success', {
            toastLife: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
        this.router.navigate(['admin/inventories', this.inventory.Id]);
      });
  }

}
