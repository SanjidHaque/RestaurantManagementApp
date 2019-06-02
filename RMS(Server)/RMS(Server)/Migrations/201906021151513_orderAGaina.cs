namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderAGaina : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "TotalPrice", c => c.Int());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "TotalPrice", c => c.Single());
        }
    }
}
