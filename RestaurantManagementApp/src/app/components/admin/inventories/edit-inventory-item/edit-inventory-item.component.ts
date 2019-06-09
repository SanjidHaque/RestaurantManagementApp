import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Params, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';


@Component({
  selector: 'app-edit-inventory-item',
  templateUrl: './edit-inventory-item.component.html',
  styleUrls: ['./edit-inventory-item.component.scss']
})
export class EditInventoryItemComponent implements OnInit {
  isDisabled = false;

  inventoryId: number;
  inventory: Inventory;
  inventories: Inventory[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService) {
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
    const editedInventoryItemName = form.value.name;

    if (editedInventoryItemName !== this.inventory.Name) {
      const editedInventoryItem = new Inventory(
        this.inventoryId,
        editedInventoryItemName,
        0,
        0,
        '',
        0,
        [],
        ''
      );

      this.inventoryDataStorageService.editInventoryItem(editedInventoryItem).
      subscribe(
        (data: any) => {
          this.toastr.successToastr('Information updated!', 'Success', {
            toastLife: 10000,
            newestOnTop: true,
            showCloseButton: true
          });
          form.reset();
          this.router.navigate(['admin/inventories', this.inventoryId]);
        }
      );
    } else {
      this.toastr.successToastr('Information updated!', 'Success', {
        toastLife: 10000,
        newestOnTop: true,
        showCloseButton: true
      });
      this.router.navigate(['admin/inventories', this.inventoryId]);
    }
  }

}
