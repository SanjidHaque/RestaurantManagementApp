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
            
            AddColumn("dbo.FoodCategories", "CategoryId", c => c.Int(nullable: false));
            CreateIndex("dbo.FoodCategories", "CategoryId");
            AddForeignKey("dbo.FoodCategories", "CategoryId", "dbo.Categories", "Id", cascadeDelete: true);
        }
        
        public override void Down()
        {
            DropForeignKey("dbo.FoodCategories", "CategoryId", "dbo.Categories");
            DropIndex("dbo.FoodCategories", new[] { "CategoryId" });
            DropColumn("dbo.FoodCategories", "CategoryId");
            DropTable("dbo.Categories");
        }
    }
}
