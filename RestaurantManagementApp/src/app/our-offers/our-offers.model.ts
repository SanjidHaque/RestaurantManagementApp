
import {SetMenu} from '../shared/set-menu.model';
import {FoodItem} from '../shared/food-item.model';

export class OurOffers {
  public SetMenu: SetMenu[];
  public FoodItem: FoodItem[];



  constructor(setMenu: SetMenu[] = [], foodItem: FoodItem[] = []) {
    this.SetMenu = setMenu;
    this.FoodItem = foodItem;

  }
}



/*

public FoodItems: SetMenuIngredients[];
,  ingredient: SetMenuIngredients[]
this.FoodItems = ingredient;*/
