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
