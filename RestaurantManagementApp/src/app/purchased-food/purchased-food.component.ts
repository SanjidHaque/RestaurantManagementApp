import {Component, Input, OnInit, Output} from '@angular/core';
import {FoodCartComponent} from '../food-cart/food-cart.component';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-purchased-food',
  templateUrl: './purchased-food.component.html',
  styleUrls: ['./purchased-food.component.scss']
})
export class PurchasedFoodComponent implements OnInit {
  @Output() getUuid;

  constructor(private route: ActivatedRoute) { }
  ngOnInit() {
  }

}
