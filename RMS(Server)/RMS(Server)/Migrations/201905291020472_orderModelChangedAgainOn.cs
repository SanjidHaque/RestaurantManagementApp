namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderModelChangedAgainOn : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "VatAmount", c => c.Single(nullable: false));
            AddColumn("dbo.Orders", "ServiceCharge", c => c.Single(nullable: false));
            AddColumn("dbo.Orders", "DiscountType", c => c.Single(nullable: false));
            AddColumn("dbo.Orders", "DiscountAmount", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "DiscountAmount");
            DropColumn("dbo.Orders", "DiscountType");
            DropColumn("dbo.Orders", "ServiceCharge");
            DropColumn("dbo.Orders", "VatAmount");
        }
    }
}
