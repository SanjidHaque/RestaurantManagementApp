import {ActivatedRoute, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subject, Subscription} from 'rxjs';
import {UUID} from 'angular2-uuid';
import {Inventory} from '../../../../models/inventory.model';
import {Ingredients} from '../../../../models/ingredients.model';
import {TableDataStorageService} from '../../../../services/table-data-storage.service';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';
import {FoodItem} from '../../../../models/food-item.model';
import {FoodItemDataStorageService} from '../../../../services/food-item-data-storage.service';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  name: string;
  price: number;
  foodItemId : string;
  sellingPrice = 0;
  profit = 0;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  foodItems: FoodItem[] = [];
  unit: number;
  inventoryCost = 0;
  checkIfEmpty = 0;
  isDisabled = false;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private foodItemDataStorageService: FoodItemDataStorageService,
           ) {}

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: Inventory[]) => {
        this.foodItems = data['foodItems'];
        this.inventories = data['inventories'];
      }
    );
    this.inventoryCost = 0;
  }


  checkIfIngredientsExist(inventoryId: number) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].InventoryId === inventoryId) {
        return i;
      }
    }
    return -1;
  }



  addIngredients(form: NgForm) {
    const ingredientId = null;
    const inventoryId = form.value.inventoryId;
    let quantity = form.value.quantity;
    const inventoryPrice = this.inventories.find(x => x.Id === inventoryId).AveragePrice;
    let subTotal = quantity * inventoryPrice;

    if (this.checkIfIngredientsExist(inventoryId) !== -1) {
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].Quantity
        += Number.parseFloat(quantity.toString());
      this.ingredients[this.checkIfIngredientsExist(inventoryId)].SubTotal
        += Number.parseFloat(subTotal.toString());

    } else {
      const name = this.inventories.find(x => x.Id === inventoryId).Name;
      subTotal = Number.parseFloat(subTotal.toFixed(2));
      quantity = Number.parseFloat(quantity.toFixed(2));

      const addIngredient = new Ingredients(
        ingredientId,
        name,
        quantity,
        inventoryId,
        subTotal,
        null
      );
      this.ingredients.push(addIngredient);
    }
      this.inventoryCost = this.inventoryCost + subTotal;
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






  addNewFoodItem(form: NgForm) {
    this.isDisabled = true;
    const name = form.value.itemName;
    const serialNumber = form.value.serialNumber;
    const price = form.value.sellingPrice;
    const foodItemIngredients = this.ingredients;
    const foodItemId = UUID.UUID();
    const profit = price - this.inventoryCost;

    const newFoodItem = new FoodItem(
      null,
      serialNumber,
      name,
      price,
      this.inventoryCost,
      profit,
      0,
      null,
      foodItemIngredients
    );


    this.foodItemDataStorageService.addNewFoodItem(newFoodItem).
    subscribe(
      (data: any) => {
        form.reset();
       // this.router.navigate(['admin/food-item/add-food-item-image', foodItemId]);
      }
    );
  }


  cancel() {
    this.router.navigate(['admin/food-item/grid-view']);
  }
}
