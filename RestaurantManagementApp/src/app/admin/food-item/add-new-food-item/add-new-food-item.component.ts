import {OurOffersService} from '../../../our-offers/our-offers.service';
import {DataStorageService} from '../../../shared/data-storage.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, OnInit, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import { Uuid } from 'ng2-uuid';
import {FoodItems} from '../../../shared/food-item.model';
import {Ingredients} from '../../../shared/ingredients.model';
import {IngredientServiceService} from './add-ingredients/ingredient-service.service';
import {Observable} from 'rxjs/Observable';
import {Http, RequestOptions} from '@angular/http';
import {Inventory} from '../../../shared/inventory.model';
import {Subject} from 'rxjs/Subject';

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
  imageUrl = '/assets/no-image.jpg';
  salePrice = 0;
  profit = 0;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  unit: number;
  inventoryCost: number;
  fileToUpload: File = null;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _http: Http,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) {
    this.uuidCodeOne = this.uuid.v1();
  }

  ngOnInit() {
    this._dataStorageService.getInventories()
      .subscribe(
        (inventories: Inventory[]) => {
          this._ourOfferService.inventory = inventories;
        }
      );
    this.inventories = this._ourOfferService.getInventories();
    this.inventoryCost = 0;
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
        return this.inventories[i].Price;
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
  //    let inventoryPrice = this.getInventoryItemPrice(inventoryId);
      const foodItemId = '';
      const addIngredient = new Ingredients(ingredientId, name, quantity,
        inventoryUnit, inventoryId, inventoryPrice, subTotal, foodItemId);
   //   this._ourOfferService.addToIngredientList(addIngredient);
      this.ingredients.push(addIngredient);
      this.ingredientsChanged.next(this.ingredients.slice());
    }


  //  for (let i = 0; i < this.ingredients.length; i++) {
      this.inventoryCost = Number.parseInt(this.inventoryCost.toString())
        + Number.parseInt(subTotal.toString());
  //  }
  //  this.router.navigate(['admin/food-item/add-new-food-item', foodItemId ]);
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


  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);

    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    }
    reader.readAsDataURL(this.fileToUpload);
  }

  OnSubmit(Image) {
    this._dataStorageService.postFile( this.foodItemId, this.fileToUpload).subscribe(
      data => {
        console.log('done');
        Image.value = null;
        this.imageUrl = '/assets/no-image.jpg';
      }
    );
  }

  onAddNewFoodItem() {


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
   /* const image = this.fileToUpload;*/
    const newFoodItem =
      new FoodItems(foodItemId, serialNumber, name, price, this.inventoryCost, profit, 0 ,
      null, foodItemIngredients );
    this._ourOfferService.addToFoodItemList(newFoodItem);
    this._dataStorageService.addFoodItem(newFoodItem);
    this.router.navigate(['admin/food-item/inventory-list-view']);
     this.form.reset();
  }


  cancel() {
    this.router.navigate(['admin/food-item/grid-view']);
  }
}
