import {Ingredients} from './ingredients.model';

export class FoodItems {
  public Name: string;
  public Id: number;
  public Price: number;
<<<<<<< HEAD
  public FoodItemImage: string;
  public Ingredients: Ingredients[];

  constructor(name: string, id: number, price: number, foodItemImage: string, ingredients: Ingredients[]) {
=======
/*
    public FoodItemImage: string;
  */

  constructor(name: string, id: number, price: number) {
>>>>>>> master
    this.Name = name;
    this.Id = id;
    this.Price = price;
/*
    this.FoodItemImage = foodItemImage;
<<<<<<< HEAD
    this.Ingredients = ingredients;
=======
*/
>>>>>>> master
  }
}
