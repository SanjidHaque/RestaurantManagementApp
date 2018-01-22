import {Ingredients} from './ingredients.model';

export class FoodItems {
  public Name: string;
  public Id: number;
  public Price: number;
  public FoodItemImage: string;
  public Ingredients: Ingredients[];

  constructor(name: string, id: number, price: number, foodItemImage: string, ingredients: Ingredients[]) {
    this.Name = name;
    this.Id = id;
    this.Price = price;

  }
}
