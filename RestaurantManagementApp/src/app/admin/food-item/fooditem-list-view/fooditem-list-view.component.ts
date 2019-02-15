import { Component, OnInit } from '@angular/core';
import {FoodItems} from '../../../models/food-item.model';
import {ActivatedRoute, Router} from '@angular/router';
import {OurOffersService} from '../../../services/our-offers.service';

@Component({
  selector: 'app-fooditem-list-view',
  templateUrl: './fooditem-list-view.component.html',
  styleUrls: ['./fooditem-list-view.component.scss']
})
export class FooditemListViewComponent implements OnInit {
  FoodItem: FoodItems[] = [];
  total: number;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private ourOffersService: OurOffersService
            ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItems[]) => {
        this.ourOffersService.FoodItem = data['foodItems'];
      }
    );
    this.FoodItem = this.ourOffersService.FoodItem;
    this.ourOffersService.foodItemChanged
      .subscribe(
        (FoodItem: FoodItems[]) => {
          this.FoodItem = FoodItem;
        }
      );
    this.total = this.ourOffersService.FoodItem.length;
  }

  viewDetails(foodItem: FoodItems) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/list-details', foodItemId]);
  }

}
