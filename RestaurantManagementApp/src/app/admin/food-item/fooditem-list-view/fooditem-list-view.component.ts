import { Component, OnInit } from '@angular/core';
import {FoodItem} from '../../../models/food-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';

@Component({
  selector: 'app-fooditem-list-view',
  templateUrl: './fooditem-list-view.component.html',
  styleUrls: ['./fooditem-list-view.component.scss']
})
export class FooditemListViewComponent implements OnInit {
  FoodItem: FoodItem[] = [];
  total: number;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private ourOffersService: OurOffersService
            ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.ourOffersService.foodItems = data['foodItems'];
      }
    );
    this.FoodItem = this.ourOffersService.foodItems;
    this.ourOffersService.foodItemsChanged
      .subscribe(
        (FoodItem: FoodItem[]) => {
          this.FoodItem = FoodItem;
        }
      );
    this.total = this.ourOffersService.foodItems.length;
  }

  viewDetails(foodItem: FoodItem) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/list-details', foodItemId]);
  }

}
