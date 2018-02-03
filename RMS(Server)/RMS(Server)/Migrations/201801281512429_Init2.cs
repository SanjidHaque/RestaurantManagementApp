namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class Init2 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.CashFlows",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        TotalSales = c.Double(nullable: false),
                        InventoryCost = c.Double(nullable: false),
                        Profit = c.Double(nullable: false),
                        InventoryId = c.String(maxLength: 128),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.Inventories", t => t.InventoryId)
                .Index(t => t.InventoryId);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.CashFlows", "InventoryId", "dbo.Inventories");
            DropIndex("dbo.CashFlows", new[] { "InventoryId" });
            DropTable("dbo.CashFlows");
        }
    }
}
