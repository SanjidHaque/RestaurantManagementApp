import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../services/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';
import {FoodItem} from '../../../models/food-item.model';
import {Ingredients} from '../../../models/ingredients.model';
import {Inventory} from '../../../models/inventory.model';
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
  FoodItemList: FoodItem[] = [];
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  FoodItem: FoodItem;
  foodItemId: string;
  isDisabled = false;
  subscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private ourOffersService: OurOffersService,
             ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params[+'id'];
        }
      );
  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.ourOffersService.FoodItem = data['foodItems'];
      }
    );

    this.FoodItemList = this.ourOffersService.FoodItem;
    this.ourOffersService.foodItemChanged
      .subscribe(
        (foodItem: FoodItem[]) => {
          this.FoodItemList = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItemList.length; i++) {
      if (this.FoodItemList[i].Id === +this.foodItemId) {
        this.FoodItem = this.FoodItemList[i];
        this.itemName = this.FoodItemList[i].Name;
        this.serialNumber = this.FoodItemList[i].SerialNo;
        this.ingredients = this.FoodItemList[i].Ingredients;
        this.salePrice = this.FoodItemList[i].Price;
        this.inventoryCost = this.FoodItemList[i].InventoryCost;
        this.profit = this.FoodItemList[i].Profit;
        this.totalSale = this.FoodItemList[i].TotalSale;
      }
    }
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.ourOffersService.inventory = data['inventories'];
      }
    );
    this.inventories = this.ourOffersService.inventory;
    this.subscription = this.ourOffersService.inventoryChanged
      .subscribe(
        (inventories: Inventory[]) => {
          this.inventories = inventories;
        }
      );
  }


  getInventoryItemName(inventoryId: number) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].Name;
      }
    }
  }


  getInventoryItemUnit(inventoryId: number) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].Unit;
      }
    }
  }


  getInventoryItemPrice(inventoryId: number) {
    for (let i = 0; i < this.inventories.length; i++) {
      if ( this.inventories[i].Id === inventoryId) {
        return this.inventories[i].AveragePrice;
      }
    }
  }


  checkIfIngredientsExist(inventoryId: number) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].InventoryId === inventoryId) {
        return i;
      }
    }
    return '';
  }


  onAddIngredients(form: NgForm) {
    const ingredientId = null;
    const inventoryId = form.value.ingName;
    const quantity = form.value.quantity;

    const inventoryPrice = this.getInventoryItemPrice(inventoryId);
    const subTotal = quantity * inventoryPrice;
    if (this.checkIfIngredientsExist(inventoryId) !== '') {
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].Quantity
        += Number.parseFloat(quantity.toString());
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].TotalPrice
        += Number.parseFloat(subTotal.toString());
    } else {

      const name = this.getInventoryItemName(inventoryId);
      const inventoryUnit = this.getInventoryItemUnit(inventoryId);
      const foodItemId = '';
      const addNewIngredient = new Ingredients(
        ingredientId,
        name,
        quantity,
        inventoryId,
        subTotal,
        foodItemId
      );
      this.ingredients.push(addNewIngredient);
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
    const editedFoodItem = new FoodItem(
      foodItemId,
      serialNumber,
      name,
      price,
      this.inventoryCost,
      profit,
      0,
      null,
      foodItemIngredients
    );
    this.dataStorageService.editFoodItem(editedFoodItem).
    subscribe(
      (data: any) => {

        this.ourOffersService.updateFoodItemList(editedFoodItem );
        this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
        form.reset();
      }
    );
  }
  cancel() {
    this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
  }

}
