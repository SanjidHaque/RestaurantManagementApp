namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryHistoryModelChangedAgain : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Inventories", "BuyingTime", c => c.String());
            AddColumn("dbo.InventoryHistories", "BuyingTime", c => c.String());
            AddColumn("dbo.InventoryHistories", "BuyingPrice", c => c.Int(nullable: false));
            DropColumn("dbo.InventoryHistories", "UpdatedTime");
            DropColumn("dbo.InventoryHistories", "CurrentPrice");
        }
        
        public override void Down()
        {
            AddColumn("dbo.InventoryHistories", "CurrentPrice", c => c.Int(nullable: false));
            AddColumn("dbo.InventoryHistories", "UpdatedTime", c => c.String());
            DropColumn("dbo.InventoryHistories", "BuyingPrice");
            DropColumn("dbo.InventoryHistories", "BuyingTime");
            DropColumn("dbo.Inventories", "BuyingTime");
        }
    }
}
