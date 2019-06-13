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
             context.Roles.AddOrUpdate(
                 new IdentityRole { Id = "1", Name = "Admin" },
                 new IdentityRole { Id = "2", Name = "Worker" }
             );
            
            var userStore = new UserStore<ApplicationUser>(context);
             var userManager = new UserManager<ApplicationUser>(userStore);
             var admin = new ApplicationUser
             {
                 UserName = "Admin",
                 Email = "hodoobeta@gmail.com",
                 PhoneNumber = "01919191919",
                 JoiningDateTime = "03:03:52 AM, 14-Jun-2019",
                 FullName = "Admin",
                 CustomPasswordResetTokenIssuedDateTime = DateTime.Now
             };
             userManager.Create(admin, "123456");
             var userId = userManager.FindByName("Admin").Id;
             userManager.AddToRole(userId, "Admin");
            
             var worker = new ApplicationUser
             {
                 UserName = "Worker",
                 Email = "hodoobeta@gmail.com",
                 PhoneNumber = "01919191919",
                 JoiningDateTime = "03:03:52 AM, 14-Jun-2019",
                 FullName = "Worker",
                 CustomPasswordResetTokenIssuedDateTime = DateTime.Now
             };
             userManager.Create(worker, "123456");
             userManager.AddToRole(worker.Id, "Worker");


            context.Settings.AddOrUpdate(x => x.Id, new Setting
            {
                ShopName = "HeadBlocks",
                ShopAddress = "29 USA",
                ShopEmail = "abc@gmail.com",
                AdditionalInformation = "",
                ServiceChargeRate = 0,
                VatRate = 0,
                ShopFacebookPage = "",
                PrintChefsOrderReceipt = false,
                ShopPhone = "19191919",
                VatRegNumber = "",
                VatType = ""
            });

        }
    }
}
