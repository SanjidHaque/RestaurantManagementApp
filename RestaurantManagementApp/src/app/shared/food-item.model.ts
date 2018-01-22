import {Ingredients} from './ingredients.model';

export class FoodItems {
  public Id: string;
  public Name: string;
  public Price: number;
<<<<<<< HEAD
  public FoodItemImage: string;
=======
>>>>>>> master
  public Ingredients: Ingredients[];
  public FoodItemImage: string;

<<<<<<< HEAD
  constructor(name: string, id: number, price: number, foodItemImage: string, ingredients: Ingredients[]) {
    this.Name = name;
=======
  constructor(id: string, name: string,  price: number,
              ingredients: Ingredients[], foodItemImage: string) {

>>>>>>> master
    this.Id = id;
    this.Name = name;
    this.Price = price;
<<<<<<< HEAD
=======
    this.Ingredients = ingredients;
    this.FoodItemImage = foodItemImage;
>>>>>>> master

  }
}
