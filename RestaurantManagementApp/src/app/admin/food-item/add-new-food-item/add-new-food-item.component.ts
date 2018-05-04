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
  salePrice : number;
  inventoryCost = 0;
  profit = 0;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  ingredientsChanged = new Subject<Ingredients[]>();
  unit: number;
  defaultUnit = 'KIl';
  fileToUpload: File = null;  constructor(private route: ActivatedRoute,
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
  //  this.defaultUnit = this.inventories[0].Unit;
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
  onAddIngredients(form: NgForm) {
    const ingredientId = this.uuid.v1();
    const inventoryId = form.value.ingName;
    const name = this.getInventoryItemName(inventoryId);
    const inventoryUnit = this.getInventoryItemUnit(inventoryId);
    const inventoryPrice = this.getInventoryItemPrice(inventoryId);
    const foodItemId = '';
    const quantity = form.value.quantity;
    const addIngredient = new Ingredients(ingredientId, name, quantity,
      inventoryUnit, inventoryId, inventoryPrice, foodItemId);
    this._ourOfferService.addToIngredientList(addIngredient);
    this.ingredients.push(addIngredient);
    this.ingredientsChanged.next(this.ingredients.slice());
    this.router.navigate(['admin/food-item/add-new-food-item', foodItemId ]);
    form.controls['quantity'].reset();
}
  deleteIngredient(index: number) {
    this.ingredients.splice(index, 1);
  }
  checkIfIngredientsExist() {
   this.ingredients = this._ourOfferService.getIngredients();
   return this.ingredients.length;
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
    this.name  = this.form.value.name;
    this.price = this.form.value.price;
  /*  this.router.navigate
    (['admin/food-item/add-new-food-item/add-ingredients', this.foodItemId]);*/
    this.router.navigate
    (['add-ingredients', this.foodItemId],
      {relativeTo: this.route});
  }

  onSaveFoodItem(form: NgForm) {
   /* const foodItemIngredients = this._ourOfferService.getIngredients();
    const foodItemId = this.foodItemId;
   /!* const image = this.fileToUpload;*!/
    const newFoodItem =
      new FoodItems(foodItemId, this.name, this.price, null,
      null, foodItemIngredients );
    this._ourOfferService.addToFoodItemList(newFoodItem);
    this._dataStorageService.addFoodItem(newFoodItem);
    this.router.navigate(['admin/food-item'])*/
    // this.form.reset();

  }


  cancel() {
    this.router.navigate(['admin/food-item/grid-view']);
  }
}
