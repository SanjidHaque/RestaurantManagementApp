import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {FoodItems} from '../../../shared/food-item.model';
import {Http} from '@angular/http';
import {Inventory} from '../../../shared/inventory.model';
import {Subject} from 'rxjs/Subject';
import {Subscription} from 'rxjs/Subscription';
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
  foodItemId : string;
  @ViewChild('newFoodItem') form: NgForm;
  salePrice = 0;
  profit = 0;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  unit: number;
  inventoryCost = 0;
  checkIfEmpty = 0;
  subscription: Subscription;
  constructor(private _route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
           ) {
    this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: Inventory[]) => {
        this._ourOfferService.inventory = data['inventories'];
      }
    );
    this.inventories = this._ourOfferService.inventory;
    this.subscription = this._ourOfferService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
    this.inventoryCost = 0;
    this.checkIfEmpty = this._ourOfferService.inventory.length;
  }



  getInventoryItemName(inventoryId: string) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].Name;
      }
    }
  }
  getInventoryItemUnit(inventoryId: string) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].Unit;
      }
    }
  }
  getInventoryItemPrice(inventoryId: string) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].AveragePrice;
      }
    }
  }

  checkIfIngredientsExist(inventoryId: string) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].InventoryId === inventoryId) {
        return i;
      }
    }
    return '';
  }

  onAddIngredients(form: NgForm) {
    const ingredientId = this.uuid.v1();
    const inventoryId = form.value.ingName;
    const quantity = form.value.quantity;
    const inventoryPrice = this.getInventoryItemPrice(inventoryId);
    const subTotal = quantity * inventoryPrice;
    if (this.checkIfIngredientsExist(inventoryId) !== '') {
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].Quantity
        += Number.parseInt(quantity.toString());
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].SubTotal
        += Number.parseInt(subTotal.toString());
    } else {
      const name = this.getInventoryItemName(inventoryId);
      const inventoryUnit = this.getInventoryItemUnit(inventoryId);
      const foodItemId = '';
      const addIngredient = new Ingredients(ingredientId, name, quantity,
        inventoryUnit, inventoryId, inventoryPrice, subTotal, foodItemId);
      this.ingredients.push(addIngredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    }
      this.inventoryCost = Number.parseInt(this.inventoryCost.toString())
        + Number.parseInt(subTotal.toString());
    form.controls['quantity'].reset();
}

  deleteIngredient(ingredient: Ingredients, index: number) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].Id === ingredient.Id ) {
        this.inventoryCost -= this.ingredients[i].SubTotal;
      }
    }
    this.ingredients.splice(index, 1);


  }






  onSaveFoodItem(form: NgForm) {
    const name = form.value.itemName;
    const serialNumber= form.value.serial;
    const price = form.value.salePrice;
    const foodItemIngredients = this.ingredients;
    const foodItemId = this.uuid.v1();
    const profit = price - this.inventoryCost;
    for (let i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i].FoodItemId = foodItemId;
    }
    const newFoodItem =
      new FoodItems(foodItemId, serialNumber, name, price, this.inventoryCost, profit, 0 ,
      null, foodItemIngredients );

    this._ourOfferService.addToFoodItemList(newFoodItem);
    this._dataStorageService.addFoodItem(newFoodItem);

    this.router.navigate(['admin/food-item/add-food-item-image', foodItemId]);
     this.form.reset();
  }


  cancel() {
    this.router.navigate(['admin/food-item/grid-view']);
  }
}
