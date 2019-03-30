import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../../models/inventory.model';
import {InventoryDataStorageService} from '../../../../services/inventory-data-storage.service';

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
        form.reset();
        this.router.navigate(['admin/inventories', this.inventoryId]);
      }
    );
  }

}
