import {NgForm} from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import {ToastrManager} from 'ng6-toastr-notifications';
import {ActivatedRoute, Data, Router} from '@angular/router';

import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/shared/admin.service';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {InventoryDataStorageService} from '../../../../services/data-storage/inventory-data-storage.service';

@Component({
  selector: 'app-add-inventory-quantity',
  templateUrl: './add-inventory-quantity.component.html',
  styleUrls: ['./add-inventory-quantity.component.scss']
})
export class AddInventoryQuantityComponent implements OnInit {
  isDisabled = false;
  inventory: Inventory;
  inventoryAdditionComments = [];
  defaultComment = 'A';



  constructor(private route: ActivatedRoute,
              private router: Router,
              private adminService: AdminService,
              private toastr: ToastrManager,
              private inventoryDataStorageService: InventoryDataStorageService ) { }

  ngOnInit() {
    this.route.data.subscribe((data: Data) => {
        this.inventory = data['inventory'];
        this.inventoryAdditionComments = this.adminService.inventoryAdditionComments;

        if (this.inventory === undefined || this.inventory === null) {
          this.toastr.errorToastr('Item not found', 'Error');
          this.router.navigate(['admin/inventories']);
        }
      }
    );
  }


  getComment(event: any) {
    this.defaultComment = event.target.value;

    if (this.defaultComment === '') {
      this.defaultComment = 'A'
    }
  }

  addInventoryQuantity(form: NgForm) {
    const price = form.value.price;
    const quantity = form.value.quantity;

    if (!this.adminService.checkNumericConditions(price, 'inventory') ||
      !this.adminService.checkNumericConditions(quantity, 'inventory') ) {
      return;
    }

    if (!confirm('Add ' + quantity + this.inventory.Unit + ' of ' + this.inventory.Name
    + ' ' + price + ' BDT' + ' per unit?')) {
      return;
    }

    this.isDisabled = true;
    const inventoryId = this.inventory.Id;
    const inventoryHistoryId = null;
    const dateTime = new Date().toLocaleString();

    if (this.defaultComment === '') {
      this.defaultComment = 'A';
    }

    const inventoryHistory = new InventoryHistory(
        inventoryHistoryId,
        inventoryId,
        quantity,
        dateTime,
        price,
      'Addition',
      this.defaultComment
    );


    this.inventoryDataStorageService.addInventoryQuantity(inventoryHistory)
      .subscribe((data: any) => {
        if (data.StatusText !== 'Success') {
          this.isDisabled = false;
          this.toastr.errorToastr(data.StatusText, 'Error');
          return;
        }

        this.toastr.successToastr('Information is updated', 'Success');
        this.router.navigate(['admin/inventories/', this.inventory.Id]);
      }
    );
  }
}
