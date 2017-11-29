using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web;

namespace RestaurantManagementAppBE.Models
{
    public class MyDbContext : DbContext
    {
        public DbSet<SetMenu> SetMenus { get; set; }
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<SetMenuItem> SetMenuItems { get; set; }
        public MyDbContext()
            : base("MyDefaultConnection")
        {
        }

        public static MyDbContext Create()
        {
            return new MyDbContext();
        }
    }
}