namespace RestaurantManagementAppBE.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class categoryaddedtofooditem : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Categories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        Name = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
            AddColumn("dbo.FoodItems", "CategoryId", c => c.Int(nullable: false));
            CreateIndex("dbo.FoodItems", "CategoryId");
            AddForeignKey("dbo.FoodItems", "CategoryId", "dbo.Categories", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FoodItems", "CategoryId", "dbo.Categories");
            DropIndex("dbo.FoodItems", new[] { "CategoryId" });
            DropColumn("dbo.FoodItems", "CategoryId");
            DropTable("dbo.Categories");
        }
    }
}
