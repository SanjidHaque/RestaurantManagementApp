import {DataStorageService} from '../../shared/data-storage.service';
import {OurOffersService} from '../../our-offers/our-offers.service';
import {OurOffers} from '../../our-offers/our-offers.model';
import {ActivatedRoute, Router} from '@angular/router';
import {FoodItems} from '../../shared/food-item.model';
import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs/Subject';
import {Http} from '@angular/http';
import {Subscription} from 'rxjs/Subscription';
import {Ingredients} from '../../shared/ingredients.model';
import { Uuid } from 'ng2-uuid';


@Component({
  selector: 'app-food-item',
  templateUrl: './food-item.component.html',
  styleUrls: ['./food-item.component.scss']
})
export class FoodItemComponent implements OnInit {
 // Menu: OurOffers;
  public menuChanged = new Subject<OurOffers>();
  FoodItem: FoodItems[] = [];
  // ingredients: Ingredients[] = [];
  // subscription = Subscription;


  constructor(private route: ActivatedRoute,
              private uuid: Uuid,
              private router: Router,
              private _dataStorageService: DataStorageService,
              private _ourOfferService: OurOffersService,
              private _http: Http) { }

  ngOnInit() {
    this._dataStorageService.getMenu()
      .subscribe(
        (Menu: OurOffers ) => {
        this._ourOfferService.FoodItem = Menu.FoodItems;
      });
    this.FoodItem = this._ourOfferService.FoodItem;

    this._ourOfferService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
  }

  editItem(foodItem: FoodItems) {
    const id = foodItem.Id;
    this.router.navigate(['admin/food-item/edit-food-item', id ]);
  }

  deleteItem(foodItem: FoodItems, index: number) {
    this._dataStorageService.deleteFoodItem(foodItem);
    this.FoodItem.splice(index, 1);
    this._ourOfferService.FoodItem.splice(index, 1);
  }

  addNewItem(foodItem: FoodItems) {
    const foodItemId = this.uuid.v1();
    this.router.navigate(['admin/food-item/add-new-food-item', foodItemId]);
    this._ourOfferService.ingredients = [];
  }

}
