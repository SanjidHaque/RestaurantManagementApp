namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Order : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Orders", "DiscountType", c => c.String());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Orders", "DiscountType", c => c.Single());
        }
    }
}
