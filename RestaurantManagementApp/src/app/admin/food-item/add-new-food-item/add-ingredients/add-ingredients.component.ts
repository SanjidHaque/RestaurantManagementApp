import { Component, OnInit } from '@angular/core';
import {DataStorageService} from '../../../../shared/data-storage.service';
import {OurOffersService} from '../../../../our-offers/our-offers.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import { Uuid } from 'ng2-uuid';
import {Ingredients} from '../../../../shared/ingredients.model';
import {Inventory} from '../../../../shared/inventory.model';
import {NgForm} from '@angular/forms';


@Component({
  selector: 'app-add-ingredients',
  templateUrl: './add-ingredients.component.html',
  styleUrls: ['./add-ingredients.component.scss']
})
export class AddIngredientsComponent implements OnInit {

  foodItemId: string;
  inventories: Inventory[] = [];
  ingredients: Ingredients[] = [];


  constructor(private route: ActivatedRoute,
              private router: Router,
              private uuid: Uuid,
              private _ourOfferService: OurOffersService,
              private _dataStorageService: DataStorageService) { }

  ngOnInit() {
    this.inventories = this._ourOfferService.getInventories();
    this.route.params
      .subscribe(
        (params: Params) => {
          this.foodItemId = params['id'];
        }
      );
  }

  onAddIngredients(form: NgForm) {
      const id = this.uuid.v1();
      const inventoryId = form.value.name;
      const foodItemId = this.foodItemId;
      const quantity = form.value.quantity;
      const unit = 1;
      const addIngredient = new Ingredients(id, quantity, unit, inventoryId, foodItemId);
      this._ourOfferService.addToIngredientList(addIngredient);
      form.reset();
      this.router.navigate(['admin/food-item/add-new-food-item']);
  }
}
