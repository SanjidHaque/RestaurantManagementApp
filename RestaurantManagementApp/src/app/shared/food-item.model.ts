import {Ingredients} from './ingredients.model';

export class FoodItems {
  public Id: string;
  public Name: string;
  public Price: number;
  public Ingredients: Ingredients[];
  public FoodItemImage: string;

  constructor(id: string, name: string,  price: number,
              ingredients: Ingredients[], foodItemImage: string) {

    this.Id = id;
    this.Name = name;
    this.Price = price;
    this.Ingredients = ingredients;
    this.FoodItemImage = foodItemImage;

  }
}
