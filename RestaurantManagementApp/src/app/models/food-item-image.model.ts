export class FoodItemImage {
  public Id: number;
  public FoodItemId: string;
  public ImagePath: string;

  constructor(id: number, foodItemId: string,  imagePath: string) {
    this.Id = id;
    this.FoodItemId = foodItemId;
    this.ImagePath = imagePath;
  }
}
