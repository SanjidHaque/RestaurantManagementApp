import {Ingredients} from './ingredients.model';

export class FoodItems {
  public Id: string;
  public Name: string;
  public Price: number;
  public Ingredients: Ingredients[];
  public FoodItemImage: string;

  constructor(name: string, id: string, price: number, foodItemImage: string, ingredients: Ingredients[]) {
    this.Name = name;
    this.Id = id;
    this.Name = name;
    this.Price = price;
    this.Ingredients = ingredients;
    this.FoodItemImage = foodItemImage;
  }
}
