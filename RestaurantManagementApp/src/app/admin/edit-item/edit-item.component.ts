import {Component, Input, OnInit} from '@angular/core';
import {OurOffers} from '../../our-offers/our-offers.model';
import {AdminDataService} from '../data.service';
import {FoodItems} from '../../shared/food-item.model';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() price: number;
  @Input() editMode: boolean;
  foodItems: FoodItems[];
  foodItem: FoodItems;

  constructor(private dataService: AdminDataService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        ( params: Params) => {
          this.id = +params['id'];
        }
      );
    this.dataService.getFoodItems()
      .subscribe(
        (manu: OurOffers) => {
          this.foodItems = manu.FoodItems;
          console.log(this.foodItems);
          this.foodItem = this.foodItems[this.id];
          this.name = this.foodItem.Name;
          this.price = this.foodItem.Price;
        }
      );
  }

  onSubmit() {

  }

  onAddItem(foodItem: FoodItems) {
    this.name = foodItem.Name;
    this.price = foodItem.Price;
  }

  onEditItem() {
    const foodItem = this.foodItems[this.id];
    // this.dataService.putFoodItem(foodItem);
    this.onAddItem(foodItem);
  }

  onCancel() {

  }

}
