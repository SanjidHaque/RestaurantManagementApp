import { Component, OnInit } from '@angular/core';
import {CashFlow} from '../../../shared/cash-flow';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {IngredientServiceService} from '../../food-item/add-new-food-item/add-ingredients/ingredient-service.service';

@Component({
  selector: 'app-cash-flow',
  templateUrl: './cash-flow.component.html',
  styleUrls: ['./cash-flow.component.scss']
})
export class CashFlowComponent implements OnInit {

  cashFlow: CashFlow[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) { }

  ngOnInit() {
    this._dataStorageService.getCashFlow()
      .subscribe(
        (cashFlow: CashFlow[]) => {
          this._ingredientService.cashFlow = cashFlow;
        }
      );
    this.cashFlow = this._ingredientService.cashFlow;
    this._ingredientService.cashFlowChanged
      .subscribe(
        (cashFlow: CashFlow[]) => {
          this.cashFlow = cashFlow;
        }
      );
  }

}
/*import { Component, OnInit } from '@angular/core';
import {Inventory} from '../../../shared/inventory.model';
import {Http} from '@angular/http';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-list-view',
  templateUrl: './inventory-list-view.component.html',
  styleUrls: ['./inventory-list-view.component.scss']
})
export class ListViewComponent implements OnInit {

  public inventories: Inventory[] ;
  subscription: Subscription;


  constructor(private route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) {

  }

  ngOnInit() {
    this._dataStorageService.getInventories()
      .subscribe(
        (inventories: Inventory[]) => {
          this._ourOfferService.inventory = inventories;
        }
      );
    this.inventories = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
  }

}*/
