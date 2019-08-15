namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChanged2 : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.InventoryHistories", "Quantity", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.InventoryHistories", "Quantity", c => c.Int(nullable: false));
        }
    }
}
