import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../shared/inventory.model';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {InventoryHistoryModel} from '../../../shared/inventory-history.model';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.scss']
})

export class AddNewInventoryComponent implements OnInit {
  unit : number;
  inventoryHistoryModel: InventoryHistoryModel[] = [];
  isDisabled = false;

  constructor(
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
  }

  ngOnInit() {
  }

  onAddNewItem(form: NgForm) {
    this.isDisabled = true;
      const inventoryId = UUID.UUID();
      const updateHistoryId = UUID.UUID();
      const name = form.value.name;
      const quantity = form.value.quantity;
      const price = form.value.currentPrice;
      const unit = form.value.unit;
      const updateTime = new Date().toLocaleString();
      const updateHistory =
        new InventoryHistoryModel(updateHistoryId, inventoryId, quantity, updateTime, unit, price );
      this.inventoryHistoryModel.push(updateHistory);
      const newItem = new Inventory(inventoryId, name, 0 , quantity,
        unit, price, this.inventoryHistoryModel);

       this._dataStorageService.addNewInventoryItem(newItem).
       subscribe(
         (data: any) => {

           this._ourOfferService.addToInventoryList(newItem);
           this.router.navigate(['admin/inventory/list-view']);
           form.reset();
         }
       );
  }



  onCancel() {
    this.router.navigate(['admin/inventory/list-view']);

  }
}
