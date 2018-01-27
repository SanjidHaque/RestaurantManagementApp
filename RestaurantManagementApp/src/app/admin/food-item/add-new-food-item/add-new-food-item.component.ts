import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {FoodItems} from '../../../shared/food-item.model';
import {Ingredients} from '../../../shared/ingredients.model';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  uuidCodeOne = '';
  name: string;
  price: number;
  ingredients: Ingredients[] = [];
  @ViewChild('newFoodItem') form: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) {
    this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
  }

  checkIfIngredientsExist() {
   this.ingredients = this._ourOfferService.getIngredients();
   return this.ingredients.length;
  }

  onAddNewFoodItem() {
    this.name  = this.form.value.name;
    this.price = this.form.value.price;
    this.router.navigate(['admin/food-item/add-new-food-item/add-ingredients', this.uuidCodeOne]);
  }

  onSaveFoodItem() {
    const newFoodItem =
      new FoodItems(this.uuidCodeOne, this.name, this.price,
      null, this._ourOfferService.getIngredients() );
    this._ourOfferService.addToFoodItemList(newFoodItem);
    this.form.reset();
  }


  onCancel() {
    this.router.navigate(['admin/food-item']);
  }
}
