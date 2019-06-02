namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderAGain : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "TotalPrice", c => c.Single());
            AlterColumn("dbo.Orders", "GrossTotalPrice", c => c.Single());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "GrossTotalPrice", c => c.Int());
            AlterColumn("dbo.Orders", "TotalPrice", c => c.Int());
        }
    }
}
