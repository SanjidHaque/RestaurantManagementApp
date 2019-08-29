namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChanged3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Inventories", "Price", c => c.Single(nullable: false));
            DropColumn("dbo.Inventories", "AveragePrice");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Inventories", "AveragePrice", c => c.Single(nullable: false));
            DropColumn("dbo.Inventories", "Price");
        }
    }
}
