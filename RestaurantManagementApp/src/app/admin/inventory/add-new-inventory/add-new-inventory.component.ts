import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../models/inventory.model';
import {OurOffersService} from '../../../services/our-offers.service';
import {DataStorageService} from '../../../services/data-storage.service';
import {InventoryHistory} from '../../../models/inventory-history.model';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.scss']
})

export class AddNewInventoryComponent implements OnInit {
  inventoryHistoryModel: InventoryHistory[] = [];
  isDisabled = false;

  constructor(private router: Router,
              private ourOffersService: OurOffersService,
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

      const updateHistory =
        new InventoryHistory(
          updateHistoryId,
          inventoryId,
          quantity,
          updateTime,
          currentPrice
        );

      this.inventoryHistoryModel.push(updateHistory);
      const newInventory = new Inventory(
        inventoryId,
        inventoryItemName,
        0,
        quantity,
        unit,
        currentPrice,
        this.inventoryHistoryModel
      );

       this.dataStorageService.addNewInventoryItem(newInventory).
       subscribe(
         (data: any) => {
           form.reset();
           this.router.navigate(['admin/inventories/list-view']);
         }
       );
  }



  onCancel() {
    this.router.navigate(['admin/inventories/list-view']);

  }
}
