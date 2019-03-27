import {Component, DoCheck, OnInit} from '@angular/core';
import {FoodItem} from '../../../models/food-item.model';
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
  public FoodItem: FoodItem[] = [];
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
      ( data: FoodItem[]) => {
        this.ourOffersService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItem = this.ourOffersService.FoodItem;
    this.subscription = this.ourOffersService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItem[]) => {
          this.FoodItem = FoodItem;
        }
      );
    for (let i = 0; i < this.FoodItem.length; i++) {
      if (this.FoodItem[i].FoodItemImageName === null || this.FoodItem[i].FoodItemImageName === '' ) {
        this.FoodItem[i].FoodItemImageName = this.imageUrl;
      } else {
        this.FoodItem[i].FoodItemImageName =  this.rootUrl + this.FoodItem[i].FoodItemImageName;
      }
    }
    this.total = this.ourOffersService.FoodItem.length;
  }



  viewDetails(foodItem: FoodItem) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/grid-details', foodItemId]);
  }
}
