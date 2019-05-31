using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
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
            //context.Roles.AddOrUpdate(
            //    new IdentityRole { Id = "1", Name = "Admin" },
            //    new IdentityRole { Id = "2", Name = "Worker" }
            //);

            //var userStore = new UserStore<ApplicationUser>(context);
            //var userManager = new UserManager<ApplicationUser>(userStore);
            //var admin = new ApplicationUser
            //{
            //    UserName = "Admin",
            //    Email = "hodoo@gmail.com"
            //};
            //userManager.Create(admin, "123456");
            //userManager.AddToRole(admin.Id, "Admin");

            //var cashier = new ApplicationUser
            //{
            //    UserName = "Worker",
            //    Email = "hodooalpha@gmail.com"
            //};
            //userManager.Create(cashier, "123456");
            //userManager.AddToRole(cashier.Id, "Cashier");

           
        }
    }
}
