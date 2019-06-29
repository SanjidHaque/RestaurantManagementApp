namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class inventoryModelChanged : DbMigration
    {
        public override void Up()
        {
            DropIndex("dbo.Ingredients", new[] { "FooditemId" });
            AlterColumn("dbo.Inventories", "AveragePrice", c => c.Single(nullable: false));
            CreateIndex("dbo.Ingredients", "FoodItemId");
        }
        
        public override void Down()
        {
            DropIndex("dbo.Ingredients", new[] { "FoodItemId" });
            AlterColumn("dbo.Inventories", "AveragePrice", c => c.Int(nullable: false));
            CreateIndex("dbo.Ingredients", "FooditemId");
        }
    }
}
