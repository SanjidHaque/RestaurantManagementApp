namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderedItemandInvenoryHistroyModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.InventoryHistories", "Quantity", c => c.Int(nullable: false));
            AddColumn("dbo.InventoryHistories", "DateTime", c => c.String());
            AddColumn("dbo.InventoryHistories", "Price", c => c.Single(nullable: false));
            AddColumn("dbo.InventoryHistories", "Type", c => c.String());
            AddColumn("dbo.InventoryHistories", "Comment", c => c.String());
            AddColumn("dbo.OrderedItems", "Status", c => c.String());
            AddColumn("dbo.OrderedItems", "CancellationReason", c => c.String());
            DropColumn("dbo.InventoryHistories", "BuyingQuantity");
            DropColumn("dbo.InventoryHistories", "BuyingTime");
            DropColumn("dbo.InventoryHistories", "BuyingPrice");
            DropColumn("dbo.OrderedItems", "OrderedItemStatus");
        }
        
        public override void Down()
        {
            AddColumn("dbo.OrderedItems", "OrderedItemStatus", c => c.String());
            AddColumn("dbo.InventoryHistories", "BuyingPrice", c => c.Single(nullable: false));
            AddColumn("dbo.InventoryHistories", "BuyingTime", c => c.String());
            AddColumn("dbo.InventoryHistories", "BuyingQuantity", c => c.Int(nullable: false));
            DropColumn("dbo.OrderedItems", "CancellationReason");
            DropColumn("dbo.OrderedItems", "Status");
            DropColumn("dbo.InventoryHistories", "Comment");
            DropColumn("dbo.InventoryHistories", "Type");
            DropColumn("dbo.InventoryHistories", "Price");
            DropColumn("dbo.InventoryHistories", "DateTime");
            DropColumn("dbo.InventoryHistories", "Quantity");
        }
    }
}
