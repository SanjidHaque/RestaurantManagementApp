using System.Collections.Generic;
using RestaurantManagementAppBE.Models;

namespace RestaurantManagementAppBE.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<RestaurantManagementAppBE.Models.MyDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(RestaurantManagementAppBE.Models.MyDbContext context)
        {
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data.
            var drinksCategory = new Category() {Name = "Drinks"};
            var fastFoodCategory = new Category() {Name = "Fast Food"};
            var chineseCategory = new Category() {Name = "Chinese Food"};
            var banglaCategory = new Category() {Name = "Bangla Food"};
            var dessertCategory = new Category() {Name = "Dessert"};
            
            context.Categories.AddOrUpdate(
                p=>p.Id,
                drinksCategory,
                fastFoodCategory,
                chineseCategory,
                banglaCategory,
                dessertCategory
                );

            var coke = new FoodItem() { Name = "Coke", Price = 30, Category = drinksCategory};
            var chickenFry = new FoodItem() { Name = "Chicken Fry", Price = 80 , Category = fastFoodCategory};
            var friedRice = new FoodItem() { Name = "Fried Rice", Price = 300 , Category = chineseCategory};

            context.FoodItems.AddOrUpdate(
                p => p.Id,
                coke,
                chickenFry,
                friedRice,
                new FoodItem { Name = "Khichuri", Price = 150 , Category = banglaCategory},
                new FoodItem { Name = "Finni", Price = 30 , Category = dessertCategory},
                new FoodItem { Name = "Water", Price = 15, Category = drinksCategory});

            context.SetMenus.AddOrUpdate(
                p => p.Id,
                new SetMenu
                {
                    Name = "Set Menu A",
                    Price = 500,
                    SetMenuItems = new List<SetMenuItem>()
                    {
                        new SetMenuItem()
                        {
                            FoodItem = friedRice,
                            Quantity = 1
                        },
                        new SetMenuItem()
                        {
                            FoodItem = coke,
                            Quantity = 2
                        },
                        new SetMenuItem()
                        {
                            FoodItem = chickenFry,
                            Quantity = 1
                        }
                    }
                },
                new SetMenu()
                {
                    Name = "Set Menu B",
                    Price = 600,
                    SetMenuItems = new List<SetMenuItem>()
                    {
                        new SetMenuItem {FoodItem = coke,Quantity = 2},
                        new SetMenuItem {FoodItem = friedRice,Quantity = 2},
                        new SetMenuItem {FoodItem = chickenFry,Quantity = 3}
                    }
                }


                );
        }
    }
}
