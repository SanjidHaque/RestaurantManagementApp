import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../our-offers/our-offers.service';
import {FoodItems} from '../../../shared/food-item.model';
import {Ingredients} from '../../../shared/ingredients.model';
import {Inventory} from '../../../shared/inventory.model';
import {NgForm} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {UUID} from 'angular2-uuid';

@Component({
  selector: 'app-edit-food-item',
  templateUrl: './edit-food-item.component.html',
  styleUrls: ['./edit-food-item.component.scss']
})
export class EditFoodItemComponent implements OnInit {
  salePrice = 0;
  profit = 0;
  totalSale : number;
  inventoryCost = 0;
  itemName = '';
  serialNumber = '';
  FoodItemList: FoodItems[] = [];
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  FoodItem: FoodItems;
  foodItemId: string;
  isDisabled = false;
  subscription: Subscription;
  constructor(private _route: ActivatedRoute,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
             ) {
    this._route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
        }
      );
  }

  ngOnInit() {
    this._route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this._ourOfferService.FoodItem = data['foodItems'];
      }
    );

    this.FoodItemList = this._ourOfferService.FoodItem;
    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItemList = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItemList.length; i++) {
      if (this.FoodItemList[i].Id === this.foodItemId) {
        this.FoodItem = this.FoodItemList[i];
        this.itemName = this.FoodItemList[i].Name;
        this.serialNumber = this.FoodItemList[i].SerialNo;
        this.ingredients = this.FoodItemList[i].Ingredients;
        this.salePrice = this.FoodItemList[i].Price;
        this.inventoryCost = this.FoodItemList[i].MakingCost;
        this.profit = this.FoodItemList[i].Profit;
        this.totalSale = this.FoodItemList[i].TotalSale;
      }
    }
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
    const ingredientId = UUID.UUID();
    const inventoryId = form.value.ingName;
    const quantity = form.value.quantity;

    const inventoryPrice = this.getInventoryItemPrice(inventoryId);
    const subTotal = quantity * inventoryPrice;
    if (this.checkIfIngredientsExist(inventoryId) !== '') {
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].Quantity
        += Number.parseFloat(quantity.toString());
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].SubTotal
        += Number.parseFloat(subTotal.toString());
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
    this.inventoryCost = Number.parseInt(this.inventoryCost.toString())
          - Number.parseInt(this.ingredients[index].SubTotal.toString());
    this.ingredients.splice(index, 1);
  }

  onSaveEditedFoodItem(form: NgForm) {
    const name = form.value.itemName;
    const price = form.value.salePrice;
    const serialNumber = form.value.serial;
    const foodItemIngredients = this.ingredients;
    const foodItemId = this.foodItemId;
    const profit = price - this.inventoryCost;
    for (let i = 0; i < this.ingredients.length; i++) {
      this.ingredients[i].FoodItemId = this.foodItemId;
    }
    this.isDisabled = true;
    const editedFoodItem =
      new FoodItems(foodItemId, serialNumber,
        name, price, this.inventoryCost, profit, 0 ,
        null, foodItemIngredients );
    this._dataStorageService.editFoodItem(editedFoodItem).
    subscribe(
      (data: any) => {

        this._ourOfferService.updateFoodItemList(editedFoodItem );
        this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
        form.reset();
      }
    );
  }
  cancel() {
    this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
  }

}
