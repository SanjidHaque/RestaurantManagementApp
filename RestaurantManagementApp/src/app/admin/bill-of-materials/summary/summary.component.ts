import { Component, OnInit } from '@angular/core';
import {SummaryOfInventory} from '../../../shared/summary-of-inventory';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {IngredientServiceService} from '../../food-item/add-new-food-item/add-ingredients/ingredient-service.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent implements OnInit {

  summaryOfInventories: SummaryOfInventory[] = [];
  constructor(private route: ActivatedRoute,
              private router: Router,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) { }

  ngOnInit() {
    this._dataStorageService.getSummaryOfInventories()
      .subscribe(
        (inventories: SummaryOfInventory[]) => {
          this._ingredientService.summaryOfInventories = inventories;
        }
      );
    this.summaryOfInventories = this._ingredientService.summaryOfInventories;
    this._ingredientService.summaryOfInventoriesChanged
      .subscribe(
        (inventories: SummaryOfInventory[]) => {
          this.summaryOfInventories = inventories;
        }
      );
  }

}
