import {Ingredients} from './ingredients.model';

export class FoodItem {
  public Id: number;
  public SerialNo: string;
  public Name: string;
  public Price: number;
  public InventoryCost: number;
  public Profit: number;
  public TotalSale: number;
  public FoodItemImageName: string;
  public Ingredients: Ingredients[];

  constructor(id: number,
              serialNo: string,
              name: string,
              price: number,
              inventoryCost: number,
              profit: number,
              totalSale: number,
              foodItemImageName: string,
              ingredients: Ingredients[]
  ) {
    this.Id = id;
    this.SerialNo = serialNo;
    this.Name = name;
    this.Price = price;
    this.InventoryCost = inventoryCost;
    this.Profit = profit;
    this.TotalSale = totalSale;
    this.Ingredients = ingredients;
    this.FoodItemImageName = foodItemImageName;

  }
}
