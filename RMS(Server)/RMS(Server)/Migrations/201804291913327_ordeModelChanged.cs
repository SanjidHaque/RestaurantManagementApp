namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ordeModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "Tendered", c => c.Int(nullable: false));
            AddColumn("dbo.Orders", "Change", c => c.Int(nullable: false));
            AddColumn("dbo.Orders", "DateTime", c => c.String());
            AddColumn("dbo.Orders", "TableNo", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.Orders", "TableNo");
            DropColumn("dbo.Orders", "DateTime");
            DropColumn("dbo.Orders", "Change");
            DropColumn("dbo.Orders", "Tendered");
        }
    }
}
