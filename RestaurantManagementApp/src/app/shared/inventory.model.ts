export class Inventory {
   public Id: string;
   public Name: string;
   public Quantity: number;
   public Unit: number;
   public Price: number;

   constructor(id: string, name: string, quantity: number, unit: number, price: number) {
     this.Id = id;
     this.Name = name;
     this.Quantity = quantity;
     this.Unit = unit;
     this.Price = price;
   }
}
