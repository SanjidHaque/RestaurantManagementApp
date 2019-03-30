namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.InventoryHistories", "BuyingQuantity", c => c.Int(nullable: false));
            DropColumn("dbo.InventoryHistories", "UpdatedQuantity");
        }
        
        public override void Down()
        {
            AddColumn("dbo.InventoryHistories", "UpdatedQuantity", c => c.Int(nullable: false));
            DropColumn("dbo.InventoryHistories", "BuyingQuantity");
        }
    }
}
