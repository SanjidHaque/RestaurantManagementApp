using System.Collections.Generic;
using RMS_Server_.Models;

namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<RMS_Server_.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(RMS_Server_.Models.ApplicationDbContext context)
        {

        //    context.Authors.AddOrUpdate(x => x.Id,
        //new Author() { Id = 1, Name = "Jane Austen" },
        //new Author() { Id = 2, Name = "Charles Dickens" },
        //new Author() { Id = 3, Name = "Miguel de Cervantes" }
        //);


            //context.Ingredients.AddOrUpdate(
            //    p => p.Id,
            //      new Ingredient() { FooditemId = 1, InventoryId = 1, Quantity = .05, Unit = 1 }, // Normal Fried Rice 
            //      new Ingredient() { FooditemId = 1, InventoryId = 2, Quantity = .01, Unit = 1 }, // Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 3, Quantity = .02, Unit = 2 }, // Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 5, Quantity = .005, Unit = 1 }, // Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 6, Quantity = .006, Unit = 1 }, // Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 7, Quantity = .006, Unit = 1 },  // Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 8, Quantity = .006, Unit = 1 },  // Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 20, Quantity = .5, Unit = 3 },// Normal Fried Rice
            //      new Ingredient() { FooditemId = 1, InventoryId = 16, Quantity = .01, Unit = 1 }, // Normal Fried Rice




            //      new Ingredient() { FooditemId = 5, InventoryId = 1, Quantity = .05, Unit = 1 }, //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 2, Quantity = .01, Unit = 1 }, //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 3, Quantity = .02, Unit = 2 }, //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 5, Quantity = .005, Unit = 1 }, //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 6, Quantity = .006, Unit = 1 }, //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 7, Quantity = .006, Unit = 1 },  //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 8, Quantity = .006, Unit = 1 },  //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 20, Quantity = .5, Unit = 3 },  //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 16, Quantity = .01, Unit = 1 },  //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 12, Quantity = .01, Unit = 2 },  //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 21, Quantity = .02, Unit = 1 },  //Indian Fried Rice
            //      new Ingredient() { FooditemId = 5, InventoryId = 17, Quantity = .04, Unit = 1 },  //Indian Fried Rice


            //      new Ingredient() { FooditemId = 4, InventoryId = 6, Quantity = .005, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 7, Quantity = .005, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 8, Quantity = .005, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 9, Quantity = .005, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 10, Quantity = .01, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 11, Quantity = .01, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 12, Quantity = .01, Unit = 2 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 13, Quantity = .01, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 14, Quantity = .01, Unit = 1 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 4, InventoryId = 15, Quantity = .01, Unit = 3 },  //Vegetable Curry
            //      new Ingredient() { FooditemId = 1, InventoryId = 21, Quantity = .03, Unit = 1 },  //Vegetable Curry



            //      new Ingredient() { FooditemId = 2, InventoryId = 2, Quantity = .01, Unit = 1 },  //Chicken Fry
            //      new Ingredient() { FooditemId = 2, InventoryId = 3, Quantity = .01, Unit = 2 },  //Chicken Fry
            //      new Ingredient() { FooditemId = 2, InventoryId = 11, Quantity = .01, Unit = 1 },  //Chicken Fry
            //      new Ingredient() { FooditemId = 2, InventoryId = 9, Quantity = .05, Unit = 1 },  //Chicken Fry
            //      new Ingredient() { FooditemId = 2, InventoryId = 24, Quantity = .5, Unit = 1 },  //Chicken Fry


            //      new Ingredient() { FooditemId = 8, InventoryId = 2, Quantity = .01, Unit = 1 },  //Chicken Wings
            //      new Ingredient() { FooditemId = 8, InventoryId = 3, Quantity = .01, Unit = 2 },  //Chicken Wings
            //      new Ingredient() { FooditemId = 8, InventoryId = 11, Quantity = .01, Unit = 1 },  //Chicken Wings
            //      new Ingredient() { FooditemId = 8, InventoryId = 9, Quantity = .05, Unit = 1 },  //Chicken Wings
            //      new Ingredient() { FooditemId = 8, InventoryId = 24, Quantity = .15, Unit = 1 },  //Chicken Wings




            //      new Ingredient() { FooditemId = 6, InventoryId = 4, Quantity = .1, Unit = 1 },   //Beef Burger
            //      new Ingredient() { FooditemId = 6, InventoryId = 3, Quantity = .09, Unit = 2 },//Beef Burger
            //      new Ingredient() { FooditemId = 6, InventoryId = 15, Quantity = 1, Unit = 3 },//Beef Burger
            //      new Ingredient() { FooditemId = 6, InventoryId = 11, Quantity = .02, Unit = 1 },//Beef Burger


            //      new Ingredient() { FooditemId = 6, InventoryId = 4, Quantity = .15, Unit = 1 },   // Special Blocks Burger
            //      new Ingredient() { FooditemId = 6, InventoryId = 3, Quantity = .09, Unit = 2 },// Special Blocks Burger
            //      new Ingredient() { FooditemId = 6, InventoryId = 15, Quantity = 1, Unit = 3 },// Special Blocks Burger
            //      new Ingredient() { FooditemId = 6, InventoryId = 11, Quantity = .02, Unit = 1 },// Special Blocks Burger

            //      new Ingredient() { FooditemId = 9, InventoryId = 2, Quantity = .01, Unit = 1 }, //Sausages
            //      new Ingredient() { FooditemId = 9, InventoryId = 4, Quantity = .09, Unit = 1 },//Sausages
            //      new Ingredient() { FooditemId = 9, InventoryId = 18, Quantity = .02, Unit = 1 },//Sausages
            //      new Ingredient() { FooditemId = 9, InventoryId = 3, Quantity = .05, Unit = 2 },//Sausages


            //      new Ingredient() { FooditemId = 3, InventoryId = 23, Quantity = 1, Unit = 4 }, //Cocacola
            //      new Ingredient() { FooditemId = 10, InventoryId = 22, Quantity = 1, Unit = 4 } //Mineral Water




            //      );

            //var rice = new Inventory() { Name = "Rice", Quantity = 50, Unit = 1, Price = 55 };
            //var soybeanOil = new Inventory() { Name = "Soybean Oil", Quantity = 10, Unit = 2, Price = 120 };
            //var onion = new Inventory() { Name = "Onion", Quantity = 5, Unit = 1, Price = 110 };
            //var cauliflower = new Inventory() { Name = "Cauliflower", Quantity = 5, Unit = 1, Price = 30 };
            //var cabbage = new Inventory() { Name = "Cabbage", Quantity = 5, Unit = 1, Price = 25 };
            //var bread = new Inventory() { Name = "Bread", Quantity = 10, Unit = 3, Price = 42 };
            //var carrot = new Inventory() { Name = "Carrot", Quantity = 10, Unit = 1, Price = 60 };
            //var parsley = new Inventory() { Name = "Parsley", Quantity = 10, Unit = 1, Price = 35 };
            //var bellPepper = new Inventory() { Name = "Bell pepper", Quantity = 10, Unit = 1, Price = 80 };
            //var lettuce = new Inventory() { Name = "Lettuce", Quantity = 10, Unit = 1, Price = 70 };
            //var garlic = new Inventory() { Name = "Garlic", Quantity = 10, Unit = 1, Price = 140 };
            //var cinnamon = new Inventory() { Name = "Cinnamon", Quantity = 10, Unit = 1, Price = 240 };
            //var ginger = new Inventory() { Name = "Ginger", Quantity = 10, Unit = 1, Price = 150 };
            //var cardamom = new Inventory() { Name = "Cardamom", Quantity = 10, Unit = 1, Price = 240 };
            //var salt = new Inventory() { Name = "Salt", Quantity = 10, Unit = 1, Price = 40 };
            //var flour = new Inventory() { Name = "Flour", Quantity = 10, Unit = 1, Price = 50 };
            //var mayonnaise = new Inventory() { Name = "Mayonnaise", Quantity = 10, Unit = 1, Price = 230 };
            //var vinegar = new Inventory() { Name = "Vinegar", Quantity = 10, Unit = 2, Price = 90 };
            //var egg = new Inventory() { Name = "Egg", Quantity = 10, Unit = 3, Price = 100 };
            //var cornStarch = new Inventory() { Name = "Corn starch", Quantity = 10, Unit = 1, Price = 90 };
            //var beef = new Inventory() { Name = "Beef", Quantity = 10, Unit = 1, Price = 390 };
            //var cocacola250ml = new Inventory() { Name = "CocaCola", Quantity = 10, Unit = 4, Price = 45 };
            //var mineralWater500ml = new Inventory() { Name = "Mineral Water", Quantity = 10, Unit = 4, Price = 20 };


            //context.Inventories.AddOrUpdate(
            //    i => i.Id,
            //    rice,
            //    salt,
            //    soybeanOil,
            //    beef,
            //    bellPepper,
            //    cabbage,
            //    cardamom,
            //    cauliflower,
            //    cornStarch,
            //    cinnamon,
            //    mayonnaise,
            //    vinegar,
            //    flour,
            //    ginger,
            //    bread,
            //    lettuce,
            //    parsley,
            //    onion,
            //    carrot,
            //    egg,
            //    garlic,
            //    mineralWater500ml,
            //    cocacola250ml
            //    );




            //context.Inventories.AddOrUpdate(
            //    i => i.Id,
            //    new Inventory() { Name = "Chicken", Quantity = 50, Unit = 1, Price = 110 });



            //var normalFriedRice = new FoodItem() { Name = "Normal Fried Rice", Price = 180, };
            //var indianFriedRice = new FoodItem() { Name = "Indian Fried Rice", Price = 250 };
            //var vegetableCurry = new FoodItem() { Name = "Vegetable Curry", Price = 220 };
            //var chickenFry = new FoodItem() { Name = "Chicken Fry", Price = 140 };
            //var chickenWings = new FoodItem() { Name = "Chicken Wings", Price = 120 };
            //var sausages = new FoodItem() { Name = "Sausages", Price = 80 };
            //var beefBurger = new FoodItem() { Name = "Beef Burger", Price = 110 };
            //var specialBlocksBurger = new FoodItem() { Name = "Special Block's Burger", Price = 180 };
            //var cocaCola = new FoodItem() { Name = "CocaCola", Price = 35 };
            //var mineralWater = new FoodItem() { Name = "Mineral Water", Price = 20 };





            //context.FoodItems.AddOrUpdate(
            //    p => p.Id,
            //    normalFriedRice,
            //    indianFriedRice,
            //    vegetableCurry,
            //    chickenFry,
            //    chickenWings,
            //    sausages,
            //    beefBurger,
            //    specialBlocksBurger,
            //    cocaCola,
            //    mineralWater
            //    );

            //context.SetMenus.AddOrUpdate(
            //    p => p.Id,
            //    new SetMenu
            //    {
            //        Name = "Set Menu A",
            //        Price = 199,
            //        SetMenuItems = new List<SetMenuItem>()
            //          {
            //              new SetMenuItem()
            //              {
            //                  FoodItem = normalFriedRice,
            //                  Quantity = 1
            //              },
            //              new SetMenuItem()
            //              {
            //                  FoodItem = chickenFry,
            //                  Quantity = 1
            //              },
            //              new SetMenuItem()
            //              {
            //                  FoodItem = cocaCola,
            //                  Quantity = 1
            //              }
            //          }
            //    },
            //    new SetMenu()
            //    {
            //        Name = "Set Menu B",
            //        Price = 299,
            //        SetMenuItems = new List<SetMenuItem>()
            //          {
            //              new SetMenuItem {FoodItem = normalFriedRice,Quantity = 1},
            //              new SetMenuItem {FoodItem = vegetableCurry,Quantity = 1},
            //              new SetMenuItem {FoodItem = cocaCola,Quantity = 1}
            //          }
            //    },


            //     new SetMenu()
            //     {
            //         Name = "Set Menu C",
            //         Price = 350,
            //         SetMenuItems = new List<SetMenuItem>()
            //          {
            //              new SetMenuItem {FoodItem = indianFriedRice,Quantity = 1},
            //              new SetMenuItem {FoodItem = vegetableCurry,Quantity = 1},
            //              new SetMenuItem {FoodItem = chickenFry,Quantity = 1},
            //              new SetMenuItem {FoodItem = cocaCola,Quantity = 1}
            //          }
            //     },

            //      new SetMenu()
            //      {
            //          Name = "Set Menu D",
            //          Price = 160,
            //          SetMenuItems = new List<SetMenuItem>()
            //          {
            //              new SetMenuItem {FoodItem = beefBurger,Quantity = 1},
            //              new SetMenuItem {FoodItem = cocaCola,Quantity = 1},
            //          }
            //      },
            //       new SetMenu()
            //       {
            //           Name = "Set Menu E",
            //           Price = 350,
            //           SetMenuItems = new List<SetMenuItem>()
            //             {
            //                 new SetMenuItem {FoodItem = specialBlocksBurger,Quantity = 1},
            //                 new SetMenuItem {FoodItem = cocaCola,Quantity = 1},
            //             }
            //       }
            //    );
        }
    }
}