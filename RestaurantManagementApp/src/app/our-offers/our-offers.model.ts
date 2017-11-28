import {SetMenuIngredients} from '../shared/set-menu-ingredients.model';

export class SetMenu {
  public Name: string;
  public Price: number;



  constructor(name: string, price: number) {
    this.Name = name;
    this.Price = price;

  }
}



/*

public FoodItems: SetMenuIngredients[];
,  ingredient: SetMenuIngredients[]
this.FoodItems = ingredient;*/
