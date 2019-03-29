import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FoodItem} from '../../../../models/food-item.model';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';

@Component({
  selector: 'app-food-item-list',
  templateUrl: './food-item-list.component.html',
  styleUrls: ['./food-item-list.component.scss']
})
export class FoodItemListComponent implements OnInit {
  foodItems: FoodItem[] = [];
  total: number;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private pointOfSaleService: PointOfSaleService
            ) { }

  ngOnInit() {
    this.route.data.
    subscribe(
      ( data: FoodItem[]) => {
        this.pointOfSaleService.foodItems = data['foodItems'];
      }
    );
    this.foodItems = this.pointOfSaleService.foodItems;
    this.pointOfSaleService.foodItemsChanged
      .subscribe(
        (FoodItem: FoodItem[]) => {
          this.foodItems = FoodItem;
        }
      );
    this.total = this.pointOfSaleService.foodItems.length;
  }

  viewDetails(foodItem: FoodItem) {
    const foodItemId =  foodItem.Id;
    this.router.navigate(['admin/food-item/food-item-details', foodItemId]);
  }

}
