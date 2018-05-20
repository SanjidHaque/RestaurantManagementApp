namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ManyModelsHasChanged : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.CashFlows", "InventoryId", "dbo.Inventories");
            DropForeignKey("dbo.SetMenuItems", "FoodItemId", "dbo.FoodItems");
            DropForeignKey("dbo.SetMenuItems", "SetMenuId", "dbo.SetMenus");
            DropForeignKey("dbo.OrderedItems", "SetMenuId", "dbo.SetMenus");
            DropForeignKey("dbo.CashFlows", "OrderId", "dbo.Orders");
            DropForeignKey("dbo.SummaryOfInventories", "InventoryId", "dbo.Inventories");
            DropIndex("dbo.CashFlows", new[] { "OrderId" });
            DropIndex("dbo.CashFlows", new[] { "InventoryId" });
            DropIndex("dbo.OrderedItems", new[] { "SetMenuId" });
            DropIndex("dbo.SetMenuItems", new[] { "SetMenuId" });
            DropIndex("dbo.SetMenuItems", new[] { "FoodItemId" });
            DropIndex("dbo.SummaryOfInventories", new[] { "InventoryId" });
            CreateTable(
                "dbo.InventoryHistoryModels",
                c => new
                    {
                        Id = c.String(nullable: false, maxLength: 128),
                        InventoryId = c.String(maxLength: 128),
                        UpdatedQuantity = c.Int(nullable: false),
                        UpdateTime = c.String(),
                        Unit = c.String(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.InventoryId)
                .Index(t => t.InventoryId);
            
            AddColumn("dbo.Inventories", "UsedQuantity", c => c.Int(nullable: false));
            AddColumn("dbo.Inventories", "RemainingQuantity", c => c.Int(nullable: false));
            AddColumn("dbo.Orders", "InventoryCost", c => c.Int(nullable: false));
            AddColumn("dbo.Orders", "Profit", c => c.Int(nullable: false));
            AddColumn("dbo.OrderedItems", "FoodItemMakingCost", c => c.Int());
            AddColumn("dbo.FoodItems", "SerialNo", c => c.String());
            AddColumn("dbo.FoodItems", "MakingCost", c => c.Int(nullable: false));
            AddColumn("dbo.FoodItems", "Profit", c => c.Int(nullable: false));
            AddColumn("dbo.FoodItems", "TotalSale", c => c.Int(nullable: false));
            AddColumn("dbo.Ingredients", "Name", c => c.String());
            AddColumn("dbo.Ingredients", "InventoryPrice", c => c.Int(nullable: false));
            AddColumn("dbo.Ingredients", "SubTotal", c => c.Int(nullable: false));
            AlterColumn("dbo.Inventories", "Unit", c => c.String());
            AlterColumn("dbo.Ingredients", "Quantity", c => c.Int(nullable: false));
            AlterColumn("dbo.Ingredients", "Unit", c => c.String());
            DropColumn("dbo.Inventories", "Quantity");
            DropColumn("dbo.OrderedItems", "SetMenuQuantity");
            DropColumn("dbo.OrderedItems", "SetMenuId");
            DropColumn("dbo.OrderedItems", "SetMenuName");
            DropColumn("dbo.OrderedItems", "SetMenuSubTotal");
            DropTable("dbo.CashFlows");
            DropTable("dbo.SetMenus");
            DropTable("dbo.SetMenuItems");
            DropTable("dbo.FileUploads");
            DropTable("dbo.FoodItemImages");
            DropTable("dbo.SummaryOfInventories");
        }
        
        public override void Down()
        {
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
                "dbo.FileUploads",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseFile = c.String(),
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
                .PrimaryKey(t => t.Id);
            
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
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.OrderedItems", "SetMenuSubTotal", c => c.Int());
            AddColumn("dbo.OrderedItems", "SetMenuName", c => c.String());
            AddColumn("dbo.OrderedItems", "SetMenuId", c => c.String(maxLength: 128));
            AddColumn("dbo.OrderedItems", "SetMenuQuantity", c => c.Int());
            AddColumn("dbo.Inventories", "Quantity", c => c.Double(nullable: false));
            DropForeignKey("dbo.InventoryHistoryModels", "InventoryId", "dbo.Inventories");
            DropIndex("dbo.InventoryHistoryModels", new[] { "InventoryId" });
            AlterColumn("dbo.Ingredients", "Unit", c => c.Int(nullable: false));
            AlterColumn("dbo.Ingredients", "Quantity", c => c.Double(nullable: false));
            AlterColumn("dbo.Inventories", "Unit", c => c.Int(nullable: false));
            DropColumn("dbo.Ingredients", "SubTotal");
            DropColumn("dbo.Ingredients", "InventoryPrice");
            DropColumn("dbo.Ingredients", "Name");
            DropColumn("dbo.FoodItems", "TotalSale");
            DropColumn("dbo.FoodItems", "Profit");
            DropColumn("dbo.FoodItems", "MakingCost");
            DropColumn("dbo.FoodItems", "SerialNo");
            DropColumn("dbo.OrderedItems", "FoodItemMakingCost");
            DropColumn("dbo.Orders", "Profit");
            DropColumn("dbo.Orders", "InventoryCost");
            DropColumn("dbo.Inventories", "RemainingQuantity");
            DropColumn("dbo.Inventories", "UsedQuantity");
            DropTable("dbo.InventoryHistoryModels");
            CreateIndex("dbo.SummaryOfInventories", "InventoryId");
            CreateIndex("dbo.SetMenuItems", "FoodItemId");
            CreateIndex("dbo.SetMenuItems", "SetMenuId");
            CreateIndex("dbo.OrderedItems", "SetMenuId");
            CreateIndex("dbo.CashFlows", "InventoryId");
            CreateIndex("dbo.CashFlows", "OrderId");
            AddForeignKey("dbo.SummaryOfInventories", "InventoryId", "dbo.Inventories", "Id");
            AddForeignKey("dbo.CashFlows", "OrderId", "dbo.Orders", "Id");
            AddForeignKey("dbo.OrderedItems", "SetMenuId", "dbo.SetMenus", "Id");
            AddForeignKey("dbo.SetMenuItems", "SetMenuId", "dbo.SetMenus", "Id");
            AddForeignKey("dbo.SetMenuItems", "FoodItemId", "dbo.FoodItems", "Id");
            AddForeignKey("dbo.CashFlows", "InventoryId", "dbo.Inventories", "Id");
        }
    }
}
