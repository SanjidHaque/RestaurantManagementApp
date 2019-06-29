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

  editInventoryItem(form: NgForm) {
    this.isDisabled = true;

    const editedInventory = new Inventory(
      this.inventory.Id,
      form.value.name,
      0,
      0,
      form.value.unit,
      0,
      [],
      ''
      );

      this.inventoryDataStorageService.editInventory(editedInventory).
      subscribe(() => {
          this.toastr.successToastr('Information updated!', 'Success', {
            toastLife: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          this.router.navigate(['admin/inventories', this.inventory.Id]);
      });
  }

}
