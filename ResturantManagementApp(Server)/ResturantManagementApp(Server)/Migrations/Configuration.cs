using ResturantManagementApp_Server_.Models;

namespace ResturantManagementApp_Server_.Migrations
{
    using System;
    using System.Data.Entity;
    using System.Data.Entity.Migrations;
    using System.Linq;

    internal sealed class Configuration : DbMigrationsConfiguration<ResturantManagementApp_Server_.Models.ApplicationDbContext>
    {
        public Configuration()
        {
            AutomaticMigrationsEnabled = false;
        }

        protected override void Seed(ResturantManagementApp_Server_.Models.ApplicationDbContext context)
        {
            context.SetMenus.AddOrUpdate(
                p => p.Id,
                new SetMenu { Name = "SetMenuA",Price = 500},
                new SetMenu { Name = "SetMenuB", Price = 600 },
                new SetMenu{ Name = "SetMenuC",Price = 700}
                );
            context.SetMenuIngredientses.AddOrUpdate(
                p => p.Id,
                new SetMenuIngredients { FoodName1 = "FriedRice",FoodName2 = "beefcurri",FoodName3 = "Coca-Cola"},
                new SetMenuIngredients { FoodName1 = "Beef Bhuna", FoodName2 = "bee Sadkara", FoodName3 = "Fanta" },
                new SetMenuIngredients { FoodName1 = "Hilsa Fish Bhuna", FoodName2 = "Duck Vuna", FoodName3 = "Normal Water" }
                );
            //  This method will be called after migrating to the latest version.

            //  You can use the DbSet<T>.AddOrUpdate() helper extension method 
            //  to avoid creating duplicate seed data. E.g.
            //
            //    context.People.AddOrUpdate(
            //      p => p.FullName,
            //      new Person { FullName = "Andrew Peters" },
            //      new Person { FullName = "Brice Lambson" },
            //      new Person { FullName = "Rowan Miller" }
            //    );
            //
        }
    }
}
