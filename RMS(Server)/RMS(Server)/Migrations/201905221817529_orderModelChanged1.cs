namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderModelChanged1 : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Orders", "ReceiptNumber");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "ReceiptNumber", c => c.String());
        }
    }
}
