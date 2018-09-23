namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class someModelIsChanged : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "InventoryCost", c => c.Single(nullable: false));
            AlterColumn("dbo.Orders", "Profit", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "Profit", c => c.Int(nullable: false));
            AlterColumn("dbo.Orders", "InventoryCost", c => c.Int(nullable: false));
        }
    }
}
