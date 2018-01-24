import {Component, Input, OnInit} from '@angular/core';
import {OurOffers} from '../../our-offers/our-offers.model';
import {AdminDataService} from '../data.service';
import {FoodItems} from '../../shared/food-item.model';
import {ActivatedRoute, Params, Router} from '@angular/router';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html',
  styleUrls: ['./edit-item.component.scss']
})
export class EditItemComponent implements OnInit {
  @Input() id: string;
  @Input() name: string;
  @Input() price: number;
  @Input() editMode: boolean;
  @Input() addNewItem: boolean;
  foodItems: FoodItems[];
  foodItem: FoodItems;

  constructor(private dataService: AdminDataService,
              private route: ActivatedRoute,
              private router: Router ) { }

  ngOnInit() {
    this.route.params
      .subscribe(
        ( params: Params) => {
          this.id = params['id'];
        }
      );
    this.dataService.getFoodItems()
      .subscribe(
        (manu: OurOffers) => {
          this.foodItems = manu.FoodItems;
          if (this.id) {
            this.foodItem = this.foodItems[this.id];
            this.name = this.foodItem.Name;
            this.price = this.foodItem.Price;
            this.editMode = true;
          }
        }
      );
  }

  onSubmit() {
    const foodItem = new FoodItems(
      this.name, this.id , this.price, null, null
    );
    if (this.editMode) {
      this.dataService.putFoodItem(foodItem);
    } else {
      this.dataService.postFoodItem(foodItem);
    }
  }

  onAddNewItem(foodItem: FoodItems) {
    this.dataService.postFoodItem(foodItem);
  }

  onCancel() {
    this.addNewItem = false;
    if (this.editMode) {
      this.editMode = false;
      this.name = '';
      this.price = null;
    }
    this.router.navigate(['/admin/view-food-item']);
  }

}
