namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderAGainaa : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "GrossTotalPrice", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "GrossTotalPrice", c => c.Single());
        }
    }
}
