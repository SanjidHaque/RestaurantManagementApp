namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderModelChangedAgain : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.Orders", "TableId", "dbo.Tables");
            DropIndex("dbo.Orders", new[] { "TableId" });
            RenameColumn(table: "dbo.Orders", name: "TableId", newName: "Table_Id");
            AlterColumn("dbo.Orders", "Table_Id", c => c.Int());
            CreateIndex("dbo.Orders", "Table_Id");
            AddForeignKey("dbo.Orders", "Table_Id", "dbo.Tables", "Id");
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.Orders", "Table_Id", "dbo.Tables");
            DropIndex("dbo.Orders", new[] { "Table_Id" });
            AlterColumn("dbo.Orders", "Table_Id", c => c.Int(nullable: false));
            RenameColumn(table: "dbo.Orders", name: "Table_Id", newName: "TableId");
            CreateIndex("dbo.Orders", "TableId");
            AddForeignKey("dbo.Orders", "TableId", "dbo.Tables", "Id", cascadeDelete: true);
        }
    }
}
