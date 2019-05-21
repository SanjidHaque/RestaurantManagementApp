namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class settingModelChanged1 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Settings", "PrintChefsOrderReceipt", c => c.Boolean(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.Settings", "PrintChefsOrderReceipt");
        }
    }
}
