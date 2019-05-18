namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class settingModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Settings", "ShopAddress", c => c.String());
            AddColumn("dbo.Settings", "ShopPhone", c => c.String());
            AddColumn("dbo.Settings", "ShopEmail", c => c.String());
            AddColumn("dbo.Settings", "ShopFacebookPage", c => c.String());
            AddColumn("dbo.Settings", "VatAmount", c => c.Single(nullable: false));
            AddColumn("dbo.Settings", "VatRegNumber", c => c.String());
            AddColumn("dbo.Settings", "VatType", c => c.String());
            AddColumn("dbo.Settings", "ServiceCharge", c => c.Single(nullable: false));
            AddColumn("dbo.Settings", "AdditionalInformation", c => c.String());
            DropColumn("dbo.Settings", "Vat");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Settings", "Vat", c => c.Single(nullable: false));
            DropColumn("dbo.Settings", "AdditionalInformation");
            DropColumn("dbo.Settings", "ServiceCharge");
            DropColumn("dbo.Settings", "VatType");
            DropColumn("dbo.Settings", "VatRegNumber");
            DropColumn("dbo.Settings", "VatAmount");
            DropColumn("dbo.Settings", "ShopFacebookPage");
            DropColumn("dbo.Settings", "ShopEmail");
            DropColumn("dbo.Settings", "ShopPhone");
            DropColumn("dbo.Settings", "ShopAddress");
        }
    }
}
