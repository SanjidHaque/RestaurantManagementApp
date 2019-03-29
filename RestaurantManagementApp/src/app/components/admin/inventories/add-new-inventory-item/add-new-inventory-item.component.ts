import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {InventoryHistory} from '../../../../models/inventory-history.model';
import {DataStorageService} from '../../../../services/data-storage.service';
import {Inventory} from '../../../../models/inventory.model';
import {AdminService} from '../../../../services/admin.service';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory-item.component.html',
  styleUrls: ['./add-new-inventory-item.component.scss']
})

export class AddNewInventoryItemComponent implements OnInit {
  isDisabled = false;

  constructor(private router: Router,
              private adminService: AdminService,
              private dataStorageService: DataStorageService) {
  }

  ngOnInit() {
  }

  addNewInventoryItem(form: NgForm) {
    this.isDisabled = true;
      const inventoryId = null;
      const updateHistoryId = null;
      const inventoryItemName = form.value.name;
      const quantity = form.value.quantity;
      const currentPrice = form.value.currentPrice;
      const unit = form.value.unit;
      const updateTime = new Date().toLocaleString();


      const inventoryHistories: InventoryHistory[] = [new InventoryHistory(
      updateHistoryId,
      inventoryId,
      quantity,
      updateTime,
      currentPrice
    )];

      const inventory = new Inventory(
        inventoryId,
        inventoryItemName,
        0,
        quantity,
        unit,
        currentPrice,
        inventoryHistories
      );

       this.dataStorageService.addNewInventoryItem(inventory).
       subscribe(
         (data: any) => {
           form.reset();
           this.router.navigate(['admin/inventories']);
         }
       );
  }



  onCancel() {
    this.router.navigate(['admin/inventories/list-view']);

  }
}
