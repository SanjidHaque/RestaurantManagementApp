import {FoodItems} from '../shared/food-item.model';
import {Ingredients} from '../shared/ingredients.model';

export class SetFoodItemsArry {
  public Id: string;
  public Name: string;
  public Price: number;
  public FoodItemImage: string;
  public Ingredients: Ingredients[];
  public isSelected: boolean;

  constructor(id: string, name: string,  price: number, foodItemImage: string,
              ingredients: Ingredients[]) {

    this.Id = id;
    this.Name = name;
    this.Price = price;

    this.Ingredients = ingredients;
    this.FoodItemImage = foodItemImage;
    this.isSelected = false;
  }
}
