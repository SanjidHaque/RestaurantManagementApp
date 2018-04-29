import {Component, Input, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import { Uuid } from 'ng2-uuid';
import {AdminDataService} from '../data.service';
import {OurOffers} from '../../our-offers/our-offers.model';
import {FoodItems} from '../../shared/food-item.model';
import {SetFoodItemsArry} from '../setMenuFoodItem.model';
import {SetMenuItems} from '../../shared/set-menu-items.model';
import {SetMenus} from '../../shared/set-menu.model';
import {NgForm} from '@angular/forms';
import {forEach} from '@angular/router/src/utils/collection';
import {SetMenuDataStoreService} from './set-menu-data-store-.service';

@Component({
  selector: 'app-add-set-menu',
  templateUrl: './add-set-menu.component.html',
  styleUrls: ['./add-set-menu.component.scss'],
  providers: [SetMenuDataStoreService]
})
export class AddSetMenuComponent implements OnInit {
  id: number;
  name: string;
  price: number;
  @Input() editMode: boolean;
   setMenuFoodItem: SetMenuItems[] = []
  @Input() addNewItem: boolean;
  foodItems: FoodItems[];
  setMenuFood: SetMenuItems;
  setMenuFoodItems: SetFoodItemsArry[];
  setMenus: SetMenus[];
  setMenu: SetMenus;
  foodItem: FoodItems;

  constructor( private router: Router,
               private setMenuStoreService: SetMenuDataStoreService,
               private dataService: AdminDataService,
               private uuid: Uuid) { }

  ngOnInit() {
  /* this.dataService.getFoodItems()
      .subscribe(
        (menu: OurOffers) => {
          this.setMenus = menu.SetMenus;
          this.foodItems = menu.FoodItems;
          this.setMenuFoodItems = [];
          for ( let i = 0; i < this.foodItems.length; i++) {
            const foodItem = new SetFoodItemsArry(
              this.foodItems[i].Id,
              this.foodItems[i].Name,
              this.foodItems[i].Price,
              this.foodItems[i].FoodItemImage,
              this.foodItems[i].Ingredients)
            this.setMenuFoodItems.push(foodItem);
          }
          }
      );*/
  }

  onSubmitSetMenu(setMenu: NgForm) {
    const setMenuId: string = this.uuid.v1();
  /*  for (let i = 0; i < this.setMenuFoodItems.length; i++) {
   if (this.setMenuFoodItems[i].isSelected === true) {
     const foodItem = new FoodItems(
       this.setMenuFoodItems[i].Id,
       this.setMenuFoodItems[i].Name,
       this.setMenuFoodItems[i].Price,
       this.setMenuFoodItems[i].FoodItemImage,
       this.setMenuFoodItems[i].Ingredients,
     );
      this.setMenuFood = new SetMenuItems(
      // this.setMenu.SetMenuItems = new SetMenuItems(
        foodItem,
        this.setMenuFoodItems[i].Id,
        this.uuid.v1(),
        1,
        setMenuId
     );
     this.setMenuFoodItem.push(this.setMenuFood);
   }

    }*/
    this.setMenu = new SetMenus(
      setMenuId,
      setMenu.value.name,
      setMenu.value.price,
      this.setMenuFoodItem,
      setMenu.value.image
      );
    this.setMenuStoreService.postSetMenu(this.setMenu);
  }

  onCancel() {
      this.router.navigate(['/admin/view-food-item']);
    }
  }

