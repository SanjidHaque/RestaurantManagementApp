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
            // context.Roles.AddOrUpdate(
            //     new IdentityRole { Id = "1", Name = "Admin" },
            //     new IdentityRole { Id = "2", Name = "Worker" }
            // );
            
            //UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(context);
            //UserManager<ApplicationUser> userManager = new UserManager<ApplicationUser>(userStore);
            //ApplicationUser admin = new ApplicationUser
            // {
            //     UserName = "Admin",
            //     Email = "hodoobeta@gmail.com",
            //     PhoneNumber = "01919191919",
            //     JoiningDateTime = "06:03:00 AM, 29-Jun-2019",
            //     FullName = "Admin",
            //     CustomPasswordResetTokenIssuedDateTime = DateTime.Now
            // };
            // userManager.Create(admin, "123456");
            // string adminId = userManager.FindByName("Admin").Id;
            // userManager.AddToRole(adminId, "Admin");
            
            // ApplicationUser worker = new ApplicationUser
            // {
            //     UserName = "Worker",
            //     Email = "hodoobeta@gmail.com",
            //     PhoneNumber = "01919191919",
            //     JoiningDateTime = "06:03:00 AM, 29-Jun-2019",
            //     FullName = "Worker",
            //     CustomPasswordResetTokenIssuedDateTime = DateTime.Now
            // };
            // userManager.Create(worker, "123456");
            // string workerId = userManager.FindByName("Worker").Id;
            // userManager.AddToRole(workerId, "Worker");
            
            
            //context.Settings.AddOrUpdate(x => x.Id, new Setting
            //{
            //    ShopName = "HeadBlocks",
            //    ShopAddress = "29, Narinda road, Dhaka.",
            //    ShopEmail = "headblocks@info.com",
            //    AdditionalInformation = "Happy hour is from 10 am to 12 am",
            //    ServiceChargeRate = 0,
            //    VatRate = 0,
            //    ShopFacebookPage = "www.facebook.com",
            //    PrintChefsOrderReceipt = true,
            //    ShopPhone = "01988174568",
            //    VatRegNumber = "Applied",
            //    VatType = "Musak-Ka"
            //});

        }
    }
}
