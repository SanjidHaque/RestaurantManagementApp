import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AdminDataService} from '../data.service';
import {OurOffers} from '../../our-offers/our-offers.model';
import {FoodItems} from '../../shared/food-item.model';
import {SetFoodItemsArry} from '../setMenuFoodItem.model';
import {SetMenuItems} from '../../shared/set-menu-items.model';
import {SetMenus} from '../../shared/set-menu.model';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-add-set-menu',
  templateUrl: './add-set-menu.component.html',
  styleUrls: ['./add-set-menu.component.scss']
})
export class AddSetMenuComponent implements OnInit {
  @Input() id: number;
  @Input() name: string;
  @Input() price: number;
  @Input() editMode: boolean;
  @Input() addNewItem: boolean;
  foodItems: FoodItems[];
  setMenuFoodItems: SetFoodItemsArry[];
  setMenu: SetMenus;
  foodItem: FoodItems;
z
  constructor( private router: Router,
               private dataService: AdminDataService ) { }

  ngOnInit() {
    /*this.dataService.getFoodItems()
      .subscribe(
        (menu: OurOffers) => {
          this.foodItems = menu.FoodItems;
          for ( let i = 0 ; i < menu.FoodItems.length; i++) {
         //   this.setMenuFoodItems[i].Id = this.foodItems[i].Id;
            this.setMenuFoodItems[i].Name = this.foodItems[i].Name;
            this.setMenuFoodItems[i].Price = this.foodItems[i].Price;
            this.setMenuFoodItems[i].isSelected = false;
            console.log(this.setMenuFoodItems[i]);

          }
          // for ( let i = 0 ; i < menu.FoodItems.length; i++) {
          //   this.setMenuFoodItems[i].Id = this.foodItems[i].Id;
          //   this.setMenuFoodItems[i].Name = this.foodItems[i].Name;
          //   this.setMenuFoodItems[i].Price = this.foodItems[i].Price;
          //   this.setMenuFoodItems[i].isSelected = false;
          //   console.log(this.setMenuFoodItems[i]);
          //
          // }

          // this.setMenuFoodItems = menu.FoodItems;
          }*//*
      );*/
  }

 /* onSubmitSetMenu(setItem: SetMenus) {
      setItem.Name = this.name;
    // this.setMenu.Name = this.name;
    // this.setMenu.Price = this.price;
    // console.log(this.price);
    // console.log(this.name);
    // this.setMenu.SetMenuItems = this.foodItems;

  }

  onCancel() {
      this.router.navigate(['/admin/view-food-item']);
    }*/

}
