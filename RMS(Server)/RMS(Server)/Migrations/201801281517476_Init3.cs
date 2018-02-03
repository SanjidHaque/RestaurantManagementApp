namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init3 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.CashFlows", "OrderId", c => c.String(maxLength: 128));
            AddColumn("dbo.CashFlows", "OrderPrice", c => c.Int(nullable: false));
            CreateIndex("dbo.CashFlows", "OrderId");
            AddForeignKey("dbo.CashFlows", "OrderId", "dbo.Orders", "Id");
            DropColumn("dbo.CashFlows", "TotalSales");
        }
        
        public override void Down()
        {
            AddColumn("dbo.CashFlows", "TotalSales", c => c.Double(nullable: false));
            DropForeignKey("dbo.CashFlows", "OrderId", "dbo.Orders");
            DropIndex("dbo.CashFlows", new[] { "OrderId" });
            DropColumn("dbo.CashFlows", "OrderPrice");
            DropColumn("dbo.CashFlows", "OrderId");
        }
    }
}
