export class FoodItems {
  public Name: string;
  public Id: number;
  public Price: number;
  public FoodItemImage: string;

  constructor(name: string, id: number, price: number, foodItemImage: string) {
    this.Name = name;
    this.Id = id;
    this.Price = price;
    this.FoodItemImage = foodItemImage;
  }
}
