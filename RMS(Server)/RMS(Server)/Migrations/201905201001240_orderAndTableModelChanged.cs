namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderAndTableModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Orders", "TableId", c => c.Int(nullable: false));
            AddColumn("dbo.Orders", "CurrentState", c => c.String());
            AddColumn("dbo.Tables", "CurrentState", c => c.String());
            CreateIndex("dbo.Orders", "TableId");
            AddForeignKey("dbo.Orders", "TableId", "dbo.Tables", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Orders", "TableId", "dbo.Tables");
            DropIndex("dbo.Orders", new[] { "TableId" });
            DropColumn("dbo.Tables", "CurrentState");
            DropColumn("dbo.Orders", "CurrentState");
            DropColumn("dbo.Orders", "TableId");
        }
    }
}
