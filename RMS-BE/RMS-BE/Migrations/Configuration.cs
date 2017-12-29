using System.Collections.Generic;
using RMS_BE.Models;

namespace RMS_BE.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<RMS_BE.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(RMS_BE.Models.ApplicationDbContext context)
        {
            var CocaCola = new FoodItem() { Name = "CocaCola", Price = 30 };
            var ChickenFry = new FoodItem() { Name = "Chicken Fry", Price = 80 };
            var FriedRice = new FoodItem() { Name = "Fried Rice", Price = 300 };
            var IndianFriedRice = new FoodItem() { Name = "Indian Fried Rice", Price = 100 };
            var FriedRiceWithCurry = new FoodItem() { Name = "Fried Rice With Vegetable Curry", Price = 100};
            var ChikenFryWithSausages = new FoodItem() { Name = "Chicken Fry with Sausages", Price = 120 };
            var BeefBurger = new FoodItem() { Name = "BeefBurger", Price = 80};
            var SpecialBlocksBurger = new FoodItem() { Name = "SpecialBlocksBurger", Price = 90};


            context.FoodItems.AddOrUpdate(
                p => p.Id,
                CocaCola,
                ChickenFry,
                FriedRice,
                IndianFriedRice,
                FriedRiceWithCurry,
                ChikenFryWithSausages,
                BeefBurger,
                SpecialBlocksBurger
                );
            context.SetMenus.AddOrUpdate(
                p => p.Id,
                new SetMenu
                {
                    Name = "Set Menu A",
                    Price = 199,
                    SetMenuItems = new List<SetMenuItem>()
                    {
                        new SetMenuItem()
                        {
                            FoodItem = FriedRice,
                            Quantity = 1
                        },
                        new SetMenuItem()
                        {
                            FoodItem = ChickenFry,
                            Quantity = 2
                        },
                        new SetMenuItem()
                        {
                            FoodItem = CocaCola,
                            Quantity = 1
                        }
                    }
                },
                new SetMenu()
                {
                    Name = "Set Menu B",
                    Price = 299,
                    SetMenuItems = new List<SetMenuItem>()
                    {
                        new SetMenuItem {FoodItem = FriedRiceWithCurry,Quantity = 2},
                        new SetMenuItem {FoodItem = ChikenFryWithSausages,Quantity = 2},
                        new SetMenuItem {FoodItem = CocaCola,Quantity = 3}
                    }
                },


                 new SetMenu()
                 {
                     Name = "Set Menu C",
                     Price = 600,
                     SetMenuItems = new List<SetMenuItem>()
                    {
                        new SetMenuItem {FoodItem = IndianFriedRice,Quantity = 2},
                        new SetMenuItem {FoodItem = ChickenFry,Quantity = 2},
                        new SetMenuItem {FoodItem = CocaCola,Quantity = 3}
                    }
                 },

                  new SetMenu()
                  {
                      Name = "Set Menu D",
                      Price = 160,
                      SetMenuItems = new List<SetMenuItem>()
                    {
                        new SetMenuItem {FoodItem = BeefBurger,Quantity = 2},
                        new SetMenuItem {FoodItem = CocaCola,Quantity = 2},
                    }
                  },
                   new SetMenu()
                   {
                       Name = "Set Menu E",
                       Price = 350,
                       SetMenuItems = new List<SetMenuItem>()
                       {
                           new SetMenuItem {FoodItem = SpecialBlocksBurger,Quantity = 1},
                           new SetMenuItem {FoodItem = CocaCola,Quantity = 2},
                       }
                   }
                );
        }
    }
}
