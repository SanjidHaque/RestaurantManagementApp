import {Component, DoCheck, OnInit} from '@angular/core';
import {FoodItems} from '../../../models/food-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';
import {Subscription} from 'rxjs';
import {DataStorageService} from '../../../services/data-storage.service';

@Component({
  selector: 'app-fooditem-grid-view',
  templateUrl: './fooditem-grid-view.component.html',
  styleUrls: ['./fooditem-grid-view.component.scss']
})
export class FooditemGridViewComponent implements OnInit {

  imageUrl = 'assets/noImage.png';
  rootUrl = '';
  public FoodItem: FoodItems[] = [];
  subscription: Subscription;
  total: number;
  constructor(private router: Router,
              private route: ActivatedRoute,
              private ourOffersService: OurOffersService,
              private dataStorageService: DataStorageService
            ) { }

  ngOnInit() {
    this.rootUrl = this.dataStorageService.rootUrl + '/Content/';
    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this.ourOffersService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItem = this.ourOffersService.FoodItem;
    this.subscription = this.ourOffersService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItem.length; i++) {
      if (this.FoodItem[i].FoodItemImage === null || this.FoodItem[i].FoodItemImage === '' ) {
        this.FoodItem[i].FoodItemImage = this.imageUrl;
      } else {
        this.FoodItem[i].FoodItemImage =  this.rootUrl + this.FoodItem[i].FoodItemImage;
      }
    }
    this.total = this.ourOffersService.FoodItem.length;
  }



  viewDetails(foodItem: FoodItems) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/grid-details', foodItemId]);
  }
}
