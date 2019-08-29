import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-override-price',
  templateUrl: './override-inventory-price.component.html',
  styleUrls: ['./override-inventory-price.component.scss']
})
export class OverrideInventoryPriceComponent implements OnInit {
  isDisabled = false;
  inventory: Inventory;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private toastr: ToastrManager,
              private adminService: AdminService,
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

  overrideInventoryPrice(form: NgForm) {
    this.isDisabled = true;
    const price = form.value.price;

    if (!this.adminService.checkNumericConditions(price, 'inventory')) {
      return;
    }

    const inventory = new Inventory(
      this.inventory.Id,
      '',
      null,
      null,
      '',
      price,
      []
    );

    this.inventoryDataStorageService.overrideInventoryPrice(inventory)
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
