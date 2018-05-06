import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Uuid } from 'ng2-uuid';
import {Ingredients} from '../../../../shared/ingredients.model';
import {Inventory} from '../../../../shared/inventory.model';
import {NgForm} from '@angular/forms';
import {IngredientServiceService} from './ingredient-service.service';


@Component({
  selector: 'app-add-ingredients',
  templateUrl: './add-ingredients.component.html',
  styleUrls: ['./add-ingredients.component.scss']
})
export class AddIngredientsComponent implements OnInit {

  foodItemId: string;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];
  unit: number;
  defaultUnit = 'Kilogram';

  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService,
              private _ingredientService: IngredientServiceService) { }

  ngOnInit() {
   // this.inventories = this._ourOfferService.getInventories();
    this._dataStorageService.getInventories()
      .subscribe(
        (inventories: Inventory[]) => {
          this._ourOfferService.inventory = inventories;
        }
      );
     this.inventories = this._ourOfferService.getInventories();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
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

  onAddIngredients(form: NgForm) {
      const id = this.uuid.v1();
      const inventoryId = form.value.name;
      const name = this.getInventoryItemName(inventoryId);
      const foodItemId = this.foodItemId;
      const quantity = form.value.quantity;
      if ( form.value.unit === 'Kilogram' ) {
          this.unit = 1;
          }
      if ( form.value.unit === 'Litre') {
          this.unit = 2;
          }
      if ( form.value.unit === 'Piece') {
          this.unit = 3;
          }
      if ( form.value.unit === 'Bottle') {
          this.unit = 4;
          }
   //   const addIngredient = new Ingredients(id, name, quantity, this.unit, inventoryId, foodItemId);
     // this._ourOfferService.addToIngredientList(addIngredient);
      this.router.navigate(['admin/food-item/add-new-food-item', foodItemId ]);
     // form.reset();
  }

  onCancel() {
    this.router.navigate(['admin/food-item/add-new-food-item', this.foodItemId]);
  }
}
