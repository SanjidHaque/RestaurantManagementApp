namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChanged1 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Inventories", "BuyingTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Inventories", "BuyingTime", c => c.String());
        }
    }
}
