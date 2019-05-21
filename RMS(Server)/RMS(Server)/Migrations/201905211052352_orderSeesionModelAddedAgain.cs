namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderSeesionModelAddedAgain : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.OrderSessions", "Order_Id", "dbo.Orders");
            DropIndex("dbo.OrderSessions", new[] { "Order_Id" });
            RenameColumn(table: "dbo.OrderSessions", name: "Order_Id", newName: "OrderId");
            AlterColumn("dbo.OrderSessions", "OrderId", c => c.Int(nullable: false));
            CreateIndex("dbo.OrderSessions", "OrderId");
            AddForeignKey("dbo.OrderSessions", "OrderId", "dbo.Orders", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.OrderSessions", "OrderId", "dbo.Orders");
            DropIndex("dbo.OrderSessions", new[] { "OrderId" });
            AlterColumn("dbo.OrderSessions", "OrderId", c => c.Int());
            RenameColumn(table: "dbo.OrderSessions", name: "OrderId", newName: "Order_Id");
            CreateIndex("dbo.OrderSessions", "Order_Id");
            AddForeignKey("dbo.OrderSessions", "Order_Id", "dbo.Orders", "Id");
        }
    }
}
