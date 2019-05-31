namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class settingModelChanged2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Settings", "VatRate", c => c.Single());
            AddColumn("dbo.Settings", "ServiceChargeRate", c => c.Single());
            DropColumn("dbo.Settings", "VatAmount");
            DropColumn("dbo.Settings", "ServiceCharge");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Settings", "ServiceCharge", c => c.Single());
            AddColumn("dbo.Settings", "VatAmount", c => c.Single());
            DropColumn("dbo.Settings", "ServiceChargeRate");
            DropColumn("dbo.Settings", "VatRate");
        }
    }
}
