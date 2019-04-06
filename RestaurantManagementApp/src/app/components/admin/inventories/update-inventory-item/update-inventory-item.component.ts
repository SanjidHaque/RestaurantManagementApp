import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';

import {Inventory} from '../../../../models/inventory.model';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';
import {ToastrManager} from 'ng6-toastr-notifications';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {

  isDisabled = false;

  inventoryId: number;
  inventory: Inventory;
  inventories: Inventory[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService ) {
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


  onUpdateInventoryItem(form: NgForm) {
    this.isDisabled = true;
    const inventoryId = this.inventoryId;
    const inventoryHistoryId = null;
    const buyingQuantity = form.value.quantity;
    const buyingPrice = form.value.price;
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
        this.router.navigate(['admin/inventories/', this.inventoryId]);
      }
    );
  }


}
