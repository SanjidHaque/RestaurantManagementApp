namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChangedAgain : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.InventoryHistories", "BuyingPrice", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.InventoryHistories", "BuyingPrice", c => c.Int(nullable: false));
        }
    }
}
