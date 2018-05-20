    import {InventoryHistoryModel} from './inventory-history.model';

export class Inventory {
   public Id: string;
   public Name: string;
   public UsedQuantity: number;
   public RemainingQuantity: number;
   public Unit: string;
   public Price: number;
   public InventoryHistoryModel: InventoryHistoryModel[];

   constructor(id: string, name: string, usedQuantity: number,
               remainingQuantity: number, unit: string,
               price: number, inventoryHistoryModel: InventoryHistoryModel[] = [] ) {
     this.Id = id;
     this.Name = name;
     this.UsedQuantity = usedQuantity;
     this.RemainingQuantity = remainingQuantity;
     this.Unit = unit;
     this.Price = price;
     this.InventoryHistoryModel = inventoryHistoryModel;
   }
}
