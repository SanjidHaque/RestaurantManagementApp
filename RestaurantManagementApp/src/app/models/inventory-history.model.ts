export class InventoryHistory {
  public Id: number;
  public InventoryId: number;
  public Quantity: number;
  public DateTime: string;
  public Price: number;
  public Type: string;
  public Comment: string;

  constructor(id: number,
              inventoryId: number,
              quantity: number,
              dateTime: string,
              price: number,
              type: string,
              comment: string
  ) {
    this.Id = id;
    this.InventoryId = inventoryId;
    this.Quantity = quantity;
    this.DateTime = dateTime;
    this.Price = price;
    this.Type = type;
    this.Comment = comment;
  }
 }
