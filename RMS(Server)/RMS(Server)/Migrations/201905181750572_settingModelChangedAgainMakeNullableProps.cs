namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class settingModelChangedAgainMakeNullableProps : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Settings", "VatAmount", c => c.Single());
            AlterColumn("dbo.Settings", "ServiceCharge", c => c.Single());
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Settings", "ServiceCharge", c => c.Single(nullable: false));
            AlterColumn("dbo.Settings", "VatAmount", c => c.Single(nullable: false));
        }
    }
}
