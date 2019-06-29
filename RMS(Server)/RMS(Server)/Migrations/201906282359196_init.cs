namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class init : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FoodItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SerialNumber = c.String(),
                        Name = c.String(),
                        Price = c.Int(nullable: false),
                        InventoryCost = c.Single(nullable: false),
                        Profit = c.Single(nullable: false),
                        TotalSale = c.Int(nullable: false),
                        FoodItemImageName = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.Ingredients",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Quantity = c.Single(nullable: false),
                        InventoryId = c.Int(nullable: false),
                        SubTotal = c.Single(nullable: false),
                        FooditemId = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FoodItems", t => t.FooditemId, cascadeDelete: true)
                .ForeignKey("dbo.Inventories", t => t.InventoryId, cascadeDelete: true)
                .Index(t => t.InventoryId)
                .Index(t => t.FooditemId);
            
            CreateTable(
                "dbo.Inventories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        UsedQuantity = c.Single(nullable: false),
                        RemainingQuantity = c.Single(nullable: false),
                        Unit = c.String(),
                        AveragePrice = c.Int(nullable: false),
                        BuyingTime = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.InventoryHistories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        InventoryId = c.Int(nullable: false),
                        BuyingQuantity = c.Int(nullable: false),
                        BuyingTime = c.String(),
                        BuyingPrice = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.InventoryId, cascadeDelete: true)
                .Index(t => t.InventoryId);
            
            CreateTable(
                "dbo.OrderedItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrderSessionId = c.Int(nullable: false),
                        FoodItemId = c.Int(nullable: false),
                        FoodItemQuantity = c.Int(nullable: false),
                        TotalPrice = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FoodItems", t => t.FoodItemId, cascadeDelete: true)
                .ForeignKey("dbo.OrderSessions", t => t.OrderSessionId, cascadeDelete: true)
                .Index(t => t.OrderSessionId)
                .Index(t => t.FoodItemId);
            
            CreateTable(
                "dbo.OrderSessions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        OrderId = c.Int(nullable: false),
                        CurrentState = c.String(),
                        OrderedDateTime = c.String(),
                        ServedDateTime = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Orders", t => t.OrderId, cascadeDelete: true)
                .Index(t => t.OrderId);
            
            CreateTable(
                "dbo.Orders",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TotalPrice = c.Int(),
                        GrossTotalPrice = c.Int(),
                        Tendered = c.Int(),
                        Change = c.Int(),
                        DateTime = c.String(),
                        InventoryCost = c.Single(),
                        Profit = c.Single(),
                        TableId = c.Int(nullable: false),
                        CurrentState = c.String(),
                        VatAmount = c.Single(),
                        ServiceChargeAmount = c.Single(),
                        DiscountType = c.String(),
                        DiscountRate = c.Single(),
                        DiscountAmount = c.Single(),
                        SalesPersonName = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Tables", t => t.TableId, cascadeDelete: true)
                .Index(t => t.TableId);
            
            CreateTable(
                "dbo.Tables",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        CurrentState = c.String(),
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
                "dbo.Settings",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ShopName = c.String(),
                        ShopAddress = c.String(),
                        ShopPhone = c.String(),
                        ShopEmail = c.String(),
                        ShopFacebookPage = c.String(),
                        VatRate = c.Single(),
                        VatRegNumber = c.String(),
                        VatType = c.String(),
                        ServiceChargeRate = c.Single(),
                        AdditionalInformation = c.String(),
                        PrintChefsOrderReceipt = c.Boolean(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.User",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        JoiningDateTime = c.String(),
                        FullName = c.String(),
                        CustomPasswordResetToken = c.String(),
                        CustomPasswordResetTokenIssuedDateTime = c.DateTime(nullable: false),
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
            DropForeignKey("dbo.UserRole", "RoleId", "dbo.Role");
            DropForeignKey("dbo.OrderedItems", "OrderSessionId", "dbo.OrderSessions");
            DropForeignKey("dbo.Orders", "TableId", "dbo.Tables");
            DropForeignKey("dbo.OrderSessions", "OrderId", "dbo.Orders");
            DropForeignKey("dbo.OrderedItems", "FoodItemId", "dbo.FoodItems");
            DropForeignKey("dbo.Ingredients", "InventoryId", "dbo.Inventories");
            DropForeignKey("dbo.InventoryHistories", "InventoryId", "dbo.Inventories");
            DropForeignKey("dbo.Ingredients", "FooditemId", "dbo.FoodItems");
            DropIndex("dbo.UserLogin", new[] { "UserId" });
            DropIndex("dbo.UserClaim", new[] { "UserId" });
            DropIndex("dbo.User", "UserNameIndex");
            DropIndex("dbo.UserRole", new[] { "RoleId" });
            DropIndex("dbo.UserRole", new[] { "UserId" });
            DropIndex("dbo.Role", "RoleNameIndex");
            DropIndex("dbo.Orders", new[] { "TableId" });
            DropIndex("dbo.OrderSessions", new[] { "OrderId" });
            DropIndex("dbo.OrderedItems", new[] { "FoodItemId" });
            DropIndex("dbo.OrderedItems", new[] { "OrderSessionId" });
            DropIndex("dbo.InventoryHistories", new[] { "InventoryId" });
            DropIndex("dbo.Ingredients", new[] { "FooditemId" });
            DropIndex("dbo.Ingredients", new[] { "InventoryId" });
            DropTable("dbo.UserLogin");
            DropTable("dbo.UserClaim");
            DropTable("dbo.User");
            DropTable("dbo.Settings");
            DropTable("dbo.UserRole");
            DropTable("dbo.Role");
            DropTable("dbo.Tables");
            DropTable("dbo.Orders");
            DropTable("dbo.OrderSessions");
            DropTable("dbo.OrderedItems");
            DropTable("dbo.InventoryHistories");
            DropTable("dbo.Inventories");
            DropTable("dbo.Ingredients");
            DropTable("dbo.FoodItems");
        }
    }
}
