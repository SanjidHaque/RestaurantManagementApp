export class Inventory {
   public Id: string;
   public Name: string;
   public Quantity: number;
   public Unit: string;
   public Price: number;

   constructor(id: string, name: string, quantity: number, unit: string, price: number) {
     this.Id = id;
     this.Name = name;
     this.Quantity = quantity;
     this.Unit = unit;
     this.Price = price;
   }
}
