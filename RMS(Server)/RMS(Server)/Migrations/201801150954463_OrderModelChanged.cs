namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OrderModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "OnChef", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "OnChef");
        }
    }
}
