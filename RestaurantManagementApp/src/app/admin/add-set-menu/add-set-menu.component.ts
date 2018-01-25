import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdminDataService} from '../data.service';
import {OurOffers} from '../../our-offers/our-offers.model';
import {FoodItems} from '../../shared/food-item.model';
import {SetFoodItemsArry} from '../setMenuFoodItem.model';
import {SetMenuItems} from '../../shared/set-menu-items.model';
import {SetMenus} from '../../shared/set-menu.model';
import {NgForm} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-add-set-menu',
  templateUrl: './add-set-menu.component.html',
  styleUrls: ['./add-set-menu.component.scss']
})
export class AddSetMenuComponent implements OnInit {
  id: number;
  name: string;
  price: number;
  @Input() editMode: boolean;
  @Input() addNewItem: boolean;
  foodItems: FoodItems[];
  setMenuFoodItems: SetFoodItemsArry[];
  setMenu: SetMenus;
  foodItem: FoodItems;


  constructor(private router: Router,
              private dataService: AdminDataService) {
  }

  ngOnInit() {
    /*this.dataService.getFoodItems()
      .subscribe(
        (menu: OurOffers) => {
          this.foodItems = menu.FoodItems;
          }


      );
  }

  onSubmitSetMenu() {
      this.setMenu.Name = this.name;
      this.setMenu.Price = this.price;
        for (let i = 0; i < this.foodItems.length; i++) {
        this.setMenu.SetMenuItems.FoodItem = this.foodItems[i];
        this.setMenu.SetMenuItems.FoodItemId = this.foodItems[i].Id;
        this.setMenu.SetMenuItems.Id = this.foodItems[i].Id;
          }
  }

  onCancel() {
      this.router.navigate(['/admin/view-food-item']);
    }*/

  }
}
