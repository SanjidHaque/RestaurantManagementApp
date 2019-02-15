    import {InventoryHistoryModel} from './inventory-history.model';

export class Inventory {
   public Id: string;
   public Name: string;
   public UsedQuantity: number;
   public RemainingQuantity: number;
   public Unit: string;
   public AveragePrice: number;
   public InventoryHistoryModel: InventoryHistoryModel[];

   constructor(id: string,
               name: string,
               usedQuantity: number,
               remainingQuantity: number,
               unit: string,
               averagePrice: number,
               inventoryHistoryModel: InventoryHistoryModel[] = []
   ) {
     this.Id = id;
     this.Name = name;
     this.UsedQuantity = usedQuantity;
     this.RemainingQuantity = remainingQuantity;
     this.Unit = unit;
     this.AveragePrice = averagePrice;
     this.InventoryHistoryModel = inventoryHistoryModel;
   }
}
