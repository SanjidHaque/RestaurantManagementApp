namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class tableModelChanged : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Orders", "Table_Id", "dbo.Tables");
            DropIndex("dbo.Orders", new[] { "Table_Id" });
            RenameColumn(table: "dbo.Orders", name: "Table_Id", newName: "TableId");
            AlterColumn("dbo.Orders", "TableId", c => c.Int(nullable: false));
            CreateIndex("dbo.Orders", "TableId");
            AddForeignKey("dbo.Orders", "TableId", "dbo.Tables", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Orders", "TableId", "dbo.Tables");
            DropIndex("dbo.Orders", new[] { "TableId" });
            AlterColumn("dbo.Orders", "TableId", c => c.Int());
            RenameColumn(table: "dbo.Orders", name: "TableId", newName: "Table_Id");
            CreateIndex("dbo.Orders", "Table_Id");
            AddForeignKey("dbo.Orders", "Table_Id", "dbo.Tables", "Id");
        }
    }
}
