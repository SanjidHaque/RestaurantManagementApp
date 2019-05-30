namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderModelChangedAgainOnAndOn : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "VatAmount", c => c.Single());
            AlterColumn("dbo.Orders", "ServiceCharge", c => c.Single());
            AlterColumn("dbo.Orders", "DiscountType", c => c.Single());
            AlterColumn("dbo.Orders", "DiscountAmount", c => c.Single());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "DiscountAmount", c => c.Single(nullable: false));
            AlterColumn("dbo.Orders", "DiscountType", c => c.Single(nullable: false));
            AlterColumn("dbo.Orders", "ServiceCharge", c => c.Single(nullable: false));
            AlterColumn("dbo.Orders", "VatAmount", c => c.Single(nullable: false));
        }
    }
}
