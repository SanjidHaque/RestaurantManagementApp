import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {FoodItems} from '../../../shared/food-item.model';
import {Ingredients} from '../../../shared/ingredients.model';
import {IngredientServiceService} from './add-ingredients/ingredient-service.service';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  uuidCodeOne = '';
  name: string;
  price: number;
  foodItemId : string;
  ingredients: Ingredients[] = [];
  @ViewChild('newFoodItem') form: NgForm;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) {
    this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
     this.route.params
     .subscribe(
       (params: Params) => {
         this.foodItemId = params['id'];
       }
     );
  }

  checkIfIngredientsExist() {
   this.ingredients = this._ourOfferService.getIngredients();
   return this.ingredients.length;
  }

  onAddNewFoodItem() {
    this.name  = this.form.value.name;
    this.price = this.form.value.price;
  /*  this.router.navigate
    (['admin/food-item/add-new-food-item/add-ingredients', this.foodItemId]);*/
    this.router.navigate
    (['add-ingredients', this.foodItemId],
      {relativeTo: this.route})
  }

  onSaveFoodItem() {
    const  foodItemIngredients = this._ourOfferService.getIngredients();
    const foodItemId = this.foodItemId;
    const newFoodItem =
      new FoodItems(foodItemId, this.name, this.price,
      null, foodItemIngredients );
    this._ourOfferService.addToFoodItemList(newFoodItem);
    this._dataStorageService.addFoodItem(newFoodItem);
    this.router.navigate(['admin/food-item'])
    // this.form.reset();
  }


  onCancel() {
    this.router.navigate(['admin/food-item']);
  }
}
