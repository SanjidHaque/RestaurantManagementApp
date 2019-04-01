import {UUID} from 'angular2-uuid';
import {NgForm} from '@angular/forms';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';


import {ToastrManager} from 'ng6-toastr-notifications';
import {FoodItem} from '../../../../models/food-item.model';
import {Inventory} from '../../../../models/inventory.model';
import {Ingredients} from '../../../../models/ingredients.model';
import {FoodItemDataStorageService} from '../../../../services/food-item-data-storage.service';

@Component({
  selector: 'app-add-new-food-item',
  templateUrl: './add-new-food-item.component.html',
  styleUrls: ['./add-new-food-item.component.scss']
})

export class AddNewFoodItemComponent implements OnInit {
  isDisabled = false;

  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  foodItems: FoodItem[] = [];

  sellingPrice = 0;
  inventoryCost = 0;
  isAddToIngredientList: boolean;


  constructor(private route: ActivatedRoute,
              private toastr: ToastrManager,
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
  }

  addOrRemoveCheck(specifier: string) {
    if (specifier === 'Add') {
      this.isAddToIngredientList = true;
    } else {
      this.isAddToIngredientList = false;
    }
  }

  checkIfIngredientsExist(inventoryId: number) {
    for (let i = 0; i < this.ingredients.length; i++) {
      if (this.ingredients[i].InventoryId === inventoryId) {
        return i;
      }
    }
    return -1;
  }

  getIngredientInfo(inventoryId: number, specifier: string) {
    const inventory = this.inventories.find(x => x.Id === inventoryId);
    if (inventory !== undefined || inventory !== null) {
      if (specifier === 'Name') {
        return inventory.Name;
      }
      if (specifier === 'Unit') {
        return inventory.Unit;
      }
      if (specifier === 'Price') {
        return inventory.AveragePrice;
      }
    }
    return '';
  }




  addIngredients(form: NgForm) {
    const ingredientId = null;
    const inventoryId = +form.value.inventoryId;
    const quantity = form.value.quantity;
    const averagePrice = this.inventories.find(x => x.Id === inventoryId).AveragePrice;
    const subTotal = quantity * averagePrice;
    const ingredientIndex = this.checkIfIngredientsExist(inventoryId);

    if (this.isAddToIngredientList) {
      if (ingredientIndex !== -1) {
        this.ingredients[ingredientIndex].Quantity += quantity;
        this.ingredients[ingredientIndex].SubTotal += subTotal;

      } else {

        const ingredient = new Ingredients(
          ingredientId,
          quantity,
          inventoryId,
          subTotal,
          null
        );
        this.ingredients.push(ingredient);
      }
      this.inventoryCost += subTotal;
    } else {

      if (ingredientIndex !== -1) {

        if (quantity < this.ingredients[ingredientIndex].Quantity) {

          this.ingredients[ingredientIndex].Quantity -= quantity;
          this.ingredients[ingredientIndex].SubTotal -= subTotal;
          this.inventoryCost -= subTotal;


        } else if (quantity === this.ingredients[ingredientIndex].Quantity) {
          this.deleteIngredient(ingredientIndex);
          this.inventoryCost -= subTotal;


        } else {
          this.toastr.errorToastr('Quantity is too large!');
        }
      } else {
        this.toastr.errorToastr('This item does not exist. Add to ingredient list first.');
      }
    }
    form.controls['quantity'].reset();
}

  deleteIngredient(index: number) {
    this.inventoryCost -= this.ingredients[index].SubTotal;
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
      (id: any) => {
        form.reset();
        this.router.navigate(['admin/food-items/', id]);
      }
    );
  }
}
