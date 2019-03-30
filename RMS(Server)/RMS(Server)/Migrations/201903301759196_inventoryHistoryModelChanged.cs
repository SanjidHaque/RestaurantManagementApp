namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryHistoryModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.InventoryHistories", "BuyingTime", c => c.String());
            DropColumn("dbo.InventoryHistories", "UpdateTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.InventoryHistories", "UpdateTime", c => c.String());
            DropColumn("dbo.InventoryHistories", "BuyingTime");
        }
    }
}
