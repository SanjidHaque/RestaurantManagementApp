namespace RestaurantManagementAppBE.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class NewDatabase : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FoodItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Price = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
            CreateTable(
                "dbo.SetMenuItems",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        SetMenuId = c.Int(nullable: false),
                        FoodItemId = c.Int(nullable: false),
                        Quantity = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id)
                .ForeignKey("dbo.FoodItems", t => t.FoodItemId, cascadeDelete: true)
                .ForeignKey("dbo.SetMenus", t => t.SetMenuId, cascadeDelete: true)
                .Index(t => t.SetMenuId)
                .Index(t => t.FoodItemId);
            
            CreateTable(
                "dbo.SetMenus",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                        Price = c.Int(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.SetMenuItems", "SetMenuId", "dbo.SetMenus");
            DropForeignKey("dbo.SetMenuItems", "FoodItemId", "dbo.FoodItems");
            DropIndex("dbo.SetMenuItems", new[] { "FoodItemId" });
            DropIndex("dbo.SetMenuItems", new[] { "SetMenuId" });
            DropTable("dbo.SetMenus");
            DropTable("dbo.SetMenuItems");
            DropTable("dbo.FoodItems");
        }
    }
}
