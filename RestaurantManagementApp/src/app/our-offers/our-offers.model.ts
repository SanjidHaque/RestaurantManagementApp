import {SetMenus} from '../shared/set-menu.model';
import {FoodItems} from '../shared/food-item.model';

export class OurOffers {
  public SetMenus: SetMenus[];
  public FoodItems: FoodItems[];

  constructor(setMenu: SetMenus[] = [], foodItem: FoodItems[] = []) {
    this.SetMenus = setMenu;
    this.FoodItems = foodItem;

  }
}



/*

public FoodItems: SetMenuIngredients[];
,  ingredient: SetMenuIngredients[]
this.FoodItems = ingredient;*/
