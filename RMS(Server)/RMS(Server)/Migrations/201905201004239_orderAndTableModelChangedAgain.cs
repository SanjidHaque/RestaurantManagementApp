namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderAndTableModelChangedAgain : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "TotalPrice", c => c.Int());
            AlterColumn("dbo.Orders", "Tendered", c => c.Int());
            AlterColumn("dbo.Orders", "Change", c => c.Int());
            AlterColumn("dbo.Orders", "InventoryCost", c => c.Single());
            AlterColumn("dbo.Orders", "Profit", c => c.Single());
            DropColumn("dbo.Orders", "TableNumber");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "TableNumber", c => c.String());
            AlterColumn("dbo.Orders", "Profit", c => c.Single(nullable: false));
            AlterColumn("dbo.Orders", "InventoryCost", c => c.Single(nullable: false));
            AlterColumn("dbo.Orders", "Change", c => c.Int(nullable: false));
            AlterColumn("dbo.Orders", "Tendered", c => c.Int(nullable: false));
            AlterColumn("dbo.Orders", "TotalPrice", c => c.Int(nullable: false));
        }
    }
}
