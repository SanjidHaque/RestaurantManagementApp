import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {Inventory} from '../../../shared/inventory.model';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {InventoryHistoryModel} from '../../../shared/inventory-history.model';

@Component({
  selector: 'app-add-new-inventory',
  templateUrl: './add-new-inventory.component.html',
  styleUrls: ['./add-new-inventory.component.scss']
})

export class AddNewInventoryComponent implements OnInit {
  unit : number;
  inventoryHistoryModel: InventoryHistoryModel[] = [];

  constructor(
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
  }

  ngOnInit() {
  }

  onAddNewItem(form: NgForm) {
      const inventoryId = this.uuid.v1();
      const updateHistoryId = this.uuid.v1();
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
       this._ourOfferService.addToInventoryList(newItem);
       this._dataStorageService.addNewInventoryItem(newItem);
      form.reset();
      this.router.navigate(['admin/inventory/list-view']);
  }



  onCancel() {
    this.router.navigate(['admin/inventory/list-view']);

  }
}
