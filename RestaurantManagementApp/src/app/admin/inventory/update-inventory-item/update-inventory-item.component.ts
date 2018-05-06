import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../shared/data-storage.service';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {InventoryHistoryModel} from '../../../shared/inventory-history.model';
import {NgForm} from '@angular/forms';
import {Inventory} from '../../../shared/inventory.model';
import { Uuid } from 'ng2-uuid';

@Component({
  selector: 'app-update-inventory-item',
  templateUrl: './update-inventory-item.component.html',
  styleUrls: ['./update-inventory-item.component.scss']
})
export class UpdateInventoryItemComponent implements OnInit {

  id: string;
  name = '';
  price: number;
  quantity: number;
  unit: string;
  inventoryHistory: InventoryHistoryModel[] = [];

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.id = params['id'];
          for (let i = 0; i < this._ourOfferService.inventory.length; i++) {
            if ( this._ourOfferService.inventory[i].Id === this.id ) {
              this.unit = this._ourOfferService.inventory[i].Unit;
              this.name = this._ourOfferService.inventory[i].Name;
            }
          }
        }
      );
  }

  onUpdateItem(form: NgForm) {
    const inventoryId = this.id;
    const updateHistoryId = this.uuid.v1();
    const quantity = form.value.quantity;
    const time = new Date().toLocaleString();
    const updateHistory =
      new InventoryHistoryModel(updateHistoryId, inventoryId, quantity, time, this.unit);
    for (let i = 0; i < this._ourOfferService.inventory.length; i++) {
      if ( this._ourOfferService.inventory[i].Id === this.id ) {
        this._ourOfferService.inventory[i].InventoryHistory.push(updateHistory);
        this._ourOfferService.inventory[i].RemainingQuantity  =
          Number.parseInt( this._ourOfferService.inventory[i].RemainingQuantity.toString())
          + Number.parseInt(quantity.toString());
      }
    }
    this._dataStorageService.updateInventoryHistory(updateHistory);
    form.reset();
    this.router.navigate(['admin/inventory/list-details', inventoryId]);
  }

  onCancel() {
    this.router.navigate(['admin/inventory/list-view']);
  }
}
