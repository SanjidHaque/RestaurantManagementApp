import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../../models/inventory.model';
import {InventoryDataStorageService} from '../../../../services/inventory-data-storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';

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
          this.inventoryId = +params['inventoryId'];
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
          window.alert('Item not found!');
          this.router.navigate(['admin/inventories']);
        }
      }
    );
  }

  onEditInventoryItem(form: NgForm) {
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
          this.toastr.warningToastr('Information is updated.');
          form.reset();
          this.router.navigate(['admin/inventories', this.inventoryId]);
        }
      );
    } else {
      this.toastr.warningToastr('Information updated.');
      this.router.navigate(['admin/inventories', this.inventoryId]);
    }
  }

}
