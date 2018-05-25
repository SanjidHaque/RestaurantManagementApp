namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Inventories", "AveragePrice", c => c.Int(nullable: false));
            AddColumn("dbo.InventoryHistoryModels", "CurrentPrice", c => c.Int(nullable: false));
            DropColumn("dbo.Inventories", "Price");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Inventories", "Price", c => c.Int(nullable: false));
            DropColumn("dbo.InventoryHistoryModels", "CurrentPrice");
            DropColumn("dbo.Inventories", "AveragePrice");
        }
    }
}
