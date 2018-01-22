import {Component, Input, OnInit} from '@angular/core';
import {FoodItems} from '../../shared/food-item.model';
import {OurOffers} from '../../our-offers/our-offers.model';
import {AdminDataService} from '../data.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AdminComponent} from '../admin.component';

@Component({
  selector: 'app-view-food-item',
  templateUrl: './view-food-item.component.html',
  styleUrls: ['./view-food-item.component.scss'],
  providers: [AdminDataService]
})
export class ViewFoodItemComponent implements OnInit {
  @Input() name: string;
  @Input() price: number;
  @Input() id: number;
  foodItems: FoodItems[];
  @Input() editMode: boolean;
  @Input() addNewItem: boolean;

  constructor( private dataService: AdminDataService,
               private route: ActivatedRoute,
               private router: Router ) { }

  ngOnInit() {
    this.dataService.getFoodItems()
      .subscribe(
        (menu: OurOffers) => {
          this.foodItems = menu.FoodItems;
        }
      );
  }

  onEditItem(id: number) {
    this.onCancel();
    this.editMode = true;
    this.name = this.foodItems[id - 1].Name;
    this.price = this.foodItems[id - 1].Price;
    this.router.navigate( ['admin/edit-item', id], [this.editMode] );
    // this.dataService.putFoodItem(foodItem);
  }


  onCancel() {
    this.addNewItem = false;
    if (this.editMode) {
      this.editMode = false;
      this.name = '';
      this.price = null;
      this.router.navigate(['/admin']);
    }
  }

  onDeleteItem(foodItem: FoodItems) {
    this.dataService.deleteFoodItem(foodItem);
  }

}
