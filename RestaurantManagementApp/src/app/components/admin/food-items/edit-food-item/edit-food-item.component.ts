import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {NgForm} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {FoodItem} from '../../../../models/food-item.model';
import {Inventory} from '../../../../models/inventory.model';
import {Ingredients} from '../../../../models/ingredients.model';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {DataStorageService} from '../../../../services/data-storage.service';

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
  foodItems: FoodItem[] = [];
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  foodItem: FoodItem;
  foodItemId: number;
  isDisabled = false;
  subscription: Subscription;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private dataStorageService: DataStorageService,
              private pointOfSaleService: PointOfSaleService,
             ) {
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = +params['inventoryId'];
        }
      );
  }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.pointOfSaleService.foodItems = data['foodItems'];
      }
    );

    this.foodItems = this.pointOfSaleService.foodItems;
    this.pointOfSaleService.foodItemsChanged
      .subscribe(
        (foodItem: FoodItem[]) => {
          this.foodItems = foodItem;
        }
      );
    for (let i = 0; i < this.foodItems.length; i++) {
      if (this.foodItems[i].Id === +this.foodItemId) {
        this.foodItem = this.foodItems[i];
        this.itemName = this.foodItems[i].Name;
        this.serialNumber = this.foodItems[i].SerialNo;
        this.ingredients = this.foodItems[i].Ingredients;
        this.salePrice = this.foodItems[i].Price;
        this.inventoryCost = this.foodItems[i].InventoryCost;
        this.profit = this.foodItems[i].Profit;
        this.totalSale = this.foodItems[i].TotalSale;
      }
    }
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.pointOfSaleService.inventories = data['inventories'];
      }
    );
    this.inventories = this.pointOfSaleService.inventories;
    this.subscription = this.pointOfSaleService.inventoriesChanged
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
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].totalPrice
        += Number.parseFloat(subTotal.toString());
    } else {

      const name = this.getInventoryItemName(inventoryId);
      const inventoryUnit = this.getInventoryItemUnit(inventoryId);
      const foodItemId = null;
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

        this.pointOfSaleService.updateFoodItemList(editedFoodItem );
        this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
        form.reset();
      }
    );
  }
  cancel() {
    this.router.navigate(['admin/food-item/grid-details', this.foodItemId]);
  }

}
