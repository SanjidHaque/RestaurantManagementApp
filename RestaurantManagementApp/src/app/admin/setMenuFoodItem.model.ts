import {FoodItems} from '../shared/food-item.model';

export class SetFoodItemsArry {
  public Id : number;
  public Name: string;
  public Price: number;
  public isSelected: boolean;

  constructor( id: number, name: string, price: number, isSelected: boolean) {
    this.Id = id;
    this.Name = name;
    this.Price = price;
    this.isSelected = isSelected;
  }
}
