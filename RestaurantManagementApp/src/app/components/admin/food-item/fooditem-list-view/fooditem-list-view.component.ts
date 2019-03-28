import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FoodItem} from '../../../../models/food-item.model';
import {PointOfSaleService} from '../../../../services/point-of-sale.service';

@Component({
  selector: 'app-fooditem-list-view',
  templateUrl: './fooditem-list-view.component.html',
  styleUrls: ['./fooditem-list-view.component.scss']
})
export class FooditemListViewComponent implements OnInit {
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
    this.router.navigate(['admin/food-item/list-details', foodItemId]);
  }

}
