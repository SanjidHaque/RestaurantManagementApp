import {InventoryHistory} from './inventory-history.model';

export class Inventory {
   public Id: number;
   public Name: string;
   public UsedQuantity: number;
   public RemainingQuantity: number;
   public Unit: string;
   public AveragePrice: number;
   public InventoryHistory: InventoryHistory[];
   public BuyingTime: string;

   constructor(id: number,
               name: string,
               usedQuantity: number,
               remainingQuantity: number,
               unit: string,
               averagePrice: number,
               inventoryHistory: InventoryHistory[] = [],
               buyingTime: string
   ) {
     this.Id = id;
     this.Name = name;
     this.UsedQuantity = usedQuantity;
     this.RemainingQuantity = remainingQuantity;
     this.Unit = unit;
     this.AveragePrice = averagePrice;
     this.InventoryHistory = inventoryHistory;
     this.BuyingTime = buyingTime;
   }
}
