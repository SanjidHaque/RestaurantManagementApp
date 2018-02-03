import {Order} from './order.model';
import {Inventory} from './inventory.model';

export class CashFlow {
  public Id: number;
  public Order: Order[];
  public OrderId: string;
  public OrderPrice: number;
  public InventoryCost: number;
  public Profit: number;
  public Inventory: Inventory[]  ;
  public InventoryId: string;

  constructor(id: number, order: Order[], orderId: string, orderPrice: number,
              inventoryCost: number, profit: number,
              inventory: Inventory[], inventoryId: string) {

    this.Id = id;
    this.Order = order;
    this.OrderId = orderId;
    this.OrderPrice = orderPrice;
    this.InventoryCost = inventoryCost;
    this.Profit = profit;
    this.Inventory = inventory;
    this.InventoryId = inventoryId;
  }
}
