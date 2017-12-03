import {FoodItems} from './food-item.model';

export class SetMenuItems {
  public FoodItem: FoodItems;
  public FoodItemId: string;
  public Id: string;
  public Quantity: number;
  public SetMenuId: string;

  constructor(foodItem: FoodItems, foodItemId: string, id: string, quantity: number, setMenuId: string) {
    this.FoodItem = foodItem;
    this.FoodItemId = foodItemId;
    this.Id = id;
    this.Quantity = quantity;
    this.SetMenuId = setMenuId;
  }
 }
