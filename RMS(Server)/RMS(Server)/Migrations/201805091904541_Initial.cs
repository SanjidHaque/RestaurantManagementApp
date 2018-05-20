namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Initial : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CashFlows",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrderId = c.String(maxLength: 128),
                        OrderPrice = c.Int(nullable: false),
                        InventoryCost = c.Double(nullable: false),
                        Profit = c.Double(nullable: false),
                        InventoryId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.InventoryId)
                .ForeignKey("dbo.Orders", t => t.OrderId)
                .Index(t => t.OrderId)
                .Index(t => t.InventoryId);
            
            CreateTable(
                "dbo.Inventories",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Quantity = c.Double(nullable: false),
                        Unit = c.Int(nullable: false),
                        Price = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        TotalPrice = c.Int(nullable: false),
                        Tendered = c.Int(nullable: false),
                        Change = c.Int(nullable: false),
                        OrderStatus = c.Int(nullable: false),
                        DateTime = c.String(),
                        TableNo = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.OrderedItems",
                c => new
                    {
                        OrderItemId = c.String(nullable: false, maxLength: 128),
                        OrderId = c.String(maxLength: 128),
                        FoodItemId = c.String(maxLength: 128),
                        SetMenuQuantity = c.Int(),
                        FoodItemQuantity = c.Int(),
                        SetMenuId = c.String(maxLength: 128),
                        SetMenuName = c.String(),
                        FoodItemName = c.String(),
                        Price = c.Int(nullable: false),
                        SetMenuSubTotal = c.Int(),
                        FoodItemSubTotal = c.Int(),
                    })
                .PrimaryKey(t => t.OrderItemId)
                .ForeignKey("dbo.FoodItems", t => t.FoodItemId)
                .ForeignKey("dbo.Orders", t => t.OrderId)
                .ForeignKey("dbo.SetMenus", t => t.SetMenuId)
                .Index(t => t.OrderId)
                .Index(t => t.FoodItemId)
                .Index(t => t.SetMenuId);
            
            CreateTable(
                "dbo.FoodItems",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Price = c.Int(nullable: false),
                        FoodItemImage = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Ingredients",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Quantity = c.Double(nullable: false),
                        Unit = c.Int(nullable: false),
                        InventoryId = c.String(maxLength: 128),
                        FooditemId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FoodItems", t => t.FooditemId)
                .ForeignKey("dbo.Inventories", t => t.InventoryId)
                .Index(t => t.InventoryId)
                .Index(t => t.FooditemId);
            
            CreateTable(
                "dbo.SetMenus",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                        Price = c.Int(nullable: false),
                        SetMenuImage = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SetMenuItems",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        SetMenuId = c.String(maxLength: 128),
                        FoodItemId = c.String(maxLength: 128),
                        Quantity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FoodItems", t => t.FoodItemId)
                .ForeignKey("dbo.SetMenus", t => t.SetMenuId)
                .Index(t => t.SetMenuId)
                .Index(t => t.FoodItemId);
            
            CreateTable(
                "dbo.FileUploads",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseFile = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.FoodItemImages",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FoodItemId = c.String(),
                        ImagePath = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Role",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.Name, unique: true, name: "RoleNameIndex");
            
            CreateTable(
                "dbo.UserRole",
                c => new
                    {
                        UserId = c.String(nullable: false, maxLength: 128),
                        RoleId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.UserId, t.RoleId })
                .ForeignKey("dbo.Role", t => t.RoleId, cascadeDelete: true)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId)
                .Index(t => t.RoleId);
            
            CreateTable(
                "dbo.SummaryOfInventories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ItemUsedName = c.String(),
                        ItemTotal = c.Double(nullable: false),
                        ItemUsedToday = c.Double(nullable: false),
                        ItemRemaining = c.Double(nullable: false),
                        InventoryId = c.String(maxLength: 128),
                        Unit = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.InventoryId)
                .Index(t => t.InventoryId);
            
            CreateTable(
                "dbo.Tables",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        FirstName = c.String(),
                        LastName = c.String(),
                        Email = c.String(maxLength: 256),
                        EmailConfirmed = c.Boolean(nullable: false),
                        PasswordHash = c.String(),
                        SecurityStamp = c.String(),
                        PhoneNumber = c.String(),
                        PhoneNumberConfirmed = c.Boolean(nullable: false),
                        TwoFactorEnabled = c.Boolean(nullable: false),
                        LockoutEndDateUtc = c.DateTime(),
                        LockoutEnabled = c.Boolean(nullable: false),
                        AccessFailedCount = c.Int(nullable: false),
                        UserName = c.String(nullable: false, maxLength: 256),
                    })
                .PrimaryKey(t => t.Id)
                .Index(t => t.UserName, unique: true, name: "UserNameIndex");
            
            CreateTable(
                "dbo.UserClaim",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserId = c.String(nullable: false, maxLength: 128),
                        ClaimType = c.String(),
                        ClaimValue = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
            CreateTable(
                "dbo.UserLogin",
                c => new
                    {
                        LoginProvider = c.String(nullable: false, maxLength: 128),
                        ProviderKey = c.String(nullable: false, maxLength: 128),
                        UserId = c.String(nullable: false, maxLength: 128),
                    })
                .PrimaryKey(t => new { t.LoginProvider, t.ProviderKey, t.UserId })
                .ForeignKey("dbo.User", t => t.UserId, cascadeDelete: true)
                .Index(t => t.UserId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.UserRole", "UserId", "dbo.User");
            DropForeignKey("dbo.UserLogin", "UserId", "dbo.User");
            DropForeignKey("dbo.UserClaim", "UserId", "dbo.User");
            DropForeignKey("dbo.SummaryOfInventories", "InventoryId", "dbo.Inventories");
            DropForeignKey("dbo.UserRole", "RoleId", "dbo.Role");
            DropForeignKey("dbo.CashFlows", "OrderId", "dbo.Orders");
            DropForeignKey("dbo.OrderedItems", "SetMenuId", "dbo.SetMenus");
            DropForeignKey("dbo.SetMenuItems", "SetMenuId", "dbo.SetMenus");
            DropForeignKey("dbo.SetMenuItems", "FoodItemId", "dbo.FoodItems");
            DropForeignKey("dbo.OrderedItems", "OrderId", "dbo.Orders");
            DropForeignKey("dbo.OrderedItems", "FoodItemId", "dbo.FoodItems");
            DropForeignKey("dbo.Ingredients", "InventoryId", "dbo.Inventories");
            DropForeignKey("dbo.Ingredients", "FooditemId", "dbo.FoodItems");
            DropForeignKey("dbo.CashFlows", "InventoryId", "dbo.Inventories");
            DropIndex("dbo.UserLogin", new[] { "UserId" });
            DropIndex("dbo.UserClaim", new[] { "UserId" });
            DropIndex("dbo.User", "UserNameIndex");
            DropIndex("dbo.SummaryOfInventories", new[] { "InventoryId" });
            DropIndex("dbo.UserRole", new[] { "RoleId" });
            DropIndex("dbo.UserRole", new[] { "UserId" });
            DropIndex("dbo.Role", "RoleNameIndex");
            DropIndex("dbo.SetMenuItems", new[] { "FoodItemId" });
            DropIndex("dbo.SetMenuItems", new[] { "SetMenuId" });
            DropIndex("dbo.Ingredients", new[] { "FooditemId" });
            DropIndex("dbo.Ingredients", new[] { "InventoryId" });
            DropIndex("dbo.OrderedItems", new[] { "SetMenuId" });
            DropIndex("dbo.OrderedItems", new[] { "FoodItemId" });
            DropIndex("dbo.OrderedItems", new[] { "OrderId" });
            DropIndex("dbo.CashFlows", new[] { "InventoryId" });
            DropIndex("dbo.CashFlows", new[] { "OrderId" });
            DropTable("dbo.UserLogin");
            DropTable("dbo.UserClaim");
            DropTable("dbo.User");
            DropTable("dbo.Tables");
            DropTable("dbo.SummaryOfInventories");
            DropTable("dbo.UserRole");
            DropTable("dbo.Role");
            DropTable("dbo.FoodItemImages");
            DropTable("dbo.FileUploads");
            DropTable("dbo.SetMenuItems");
            DropTable("dbo.SetMenus");
            DropTable("dbo.Ingredients");
            DropTable("dbo.FoodItems");
            DropTable("dbo.OrderedItems");
            DropTable("dbo.Orders");
            DropTable("dbo.Inventories");
            DropTable("dbo.CashFlows");
        }
    }
}
