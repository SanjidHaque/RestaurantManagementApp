import {InventoryHistory} from './inventory-history.model';

export class Inventory {
   public Id: number;
   public Name: string;
   public UsedQuantity: number;
   public RemainingQuantity: number;
   public Unit: string;
   public Price: number;
   public InventoryHistory: InventoryHistory[];

   constructor(id: number,
               name: string,
               usedQuantity: number,
               remainingQuantity: number,
               unit: string,
               price: number,
               inventoryHistory: InventoryHistory[] = []
   ) {
     this.Id = id;
     this.Name = name;
     this.UsedQuantity = usedQuantity;
     this.RemainingQuantity = remainingQuantity;
     this.Unit = unit;
     this.Price = price;
     this.InventoryHistory = inventoryHistory;
   }
}
