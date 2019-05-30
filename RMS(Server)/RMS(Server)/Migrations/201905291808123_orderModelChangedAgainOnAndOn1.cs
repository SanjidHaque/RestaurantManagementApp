namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderModelChangedAgainOnAndOn1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "GrossTotalPrice", c => c.Int());
            AddColumn("dbo.Orders", "Vat", c => c.Single());
            DropColumn("dbo.Orders", "VatAmount");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "VatAmount", c => c.Single());
            DropColumn("dbo.Orders", "Vat");
            DropColumn("dbo.Orders", "GrossTotalPrice");
        }
    }
}
