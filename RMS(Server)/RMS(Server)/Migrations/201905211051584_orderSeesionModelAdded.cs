namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderSeesionModelAdded : DbMigration
    {
        public override void Up()
        {
            DropForeignKey("dbo.OrderedItems", "OrderId", "dbo.Orders");
            DropIndex("dbo.OrderedItems", new[] { "OrderId" });
            CreateTable(
                "dbo.OrderSessions",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CurrentState = c.String(),
                        Order_Id = c.Int(),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Orders", t => t.Order_Id)
                .Index(t => t.Order_Id);
            
            AddColumn("dbo.OrderedItems", "OrderSessionId", c => c.Int(nullable: false));
            CreateIndex("dbo.OrderedItems", "OrderSessionId");
            AddForeignKey("dbo.OrderedItems", "OrderSessionId", "dbo.OrderSessions", "Id", cascadeDelete: true);
            DropColumn("dbo.OrderedItems", "OrderId");
        }
        
        public override void Down()
        {
            AddColumn("dbo.OrderedItems", "OrderId", c => c.Int(nullable: false));
            DropForeignKey("dbo.OrderSessions", "Order_Id", "dbo.Orders");
            DropForeignKey("dbo.OrderedItems", "OrderSessionId", "dbo.OrderSessions");
            DropIndex("dbo.OrderSessions", new[] { "Order_Id" });
            DropIndex("dbo.OrderedItems", new[] { "OrderSessionId" });
            DropColumn("dbo.OrderedItems", "OrderSessionId");
            DropTable("dbo.OrderSessions");
            CreateIndex("dbo.OrderedItems", "OrderId");
            AddForeignKey("dbo.OrderedItems", "OrderId", "dbo.Orders", "Id", cascadeDelete: true);
        }
    }
}
