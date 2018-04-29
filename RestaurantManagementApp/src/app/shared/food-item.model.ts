import {Ingredients} from './ingredients.model';
import { FoodItemImage } from './food-item-image.model';

export class FoodItems {
  public Id: string;
  public Name: string;
  public Price: number;
  public FoodItemImage: string;
  public Ingredients: Ingredients[];

  constructor(id: string, name: string,  price: number,
              foodItemImage: string, ingredients: Ingredients[]) {
    this.Id = id;
    this.Name = name;
    this.Price = price;
    this.Ingredients = ingredients;
    this.FoodItemImage = foodItemImage;
  }
}
