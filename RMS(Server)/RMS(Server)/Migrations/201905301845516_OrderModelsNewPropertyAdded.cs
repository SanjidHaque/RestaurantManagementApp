namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OrderModelsNewPropertyAdded : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderSessions", "OrderedDateTime", c => c.String());
            AddColumn("dbo.OrderSessions", "ServedDateTime", c => c.String());
            AddColumn("dbo.Orders", "VatAmount", c => c.Single());
            AddColumn("dbo.Orders", "ServiceChargeAmount", c => c.Single());
            AddColumn("dbo.Orders", "DiscountRate", c => c.Single());
            AddColumn("dbo.Orders", "SalesPersonName", c => c.String());
            DropColumn("dbo.Orders", "Vat");
            DropColumn("dbo.Orders", "ServiceCharge");
            DropColumn("dbo.Orders", "Username");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "Username", c => c.String());
            AddColumn("dbo.Orders", "ServiceCharge", c => c.Single());
            AddColumn("dbo.Orders", "Vat", c => c.Single());
            DropColumn("dbo.Orders", "SalesPersonName");
            DropColumn("dbo.Orders", "DiscountRate");
            DropColumn("dbo.Orders", "ServiceChargeAmount");
            DropColumn("dbo.Orders", "VatAmount");
            DropColumn("dbo.OrderSessions", "ServedDateTime");
            DropColumn("dbo.OrderSessions", "OrderedDateTime");
        }
    }
}
