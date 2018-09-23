namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class typeChanged : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.FoodItems", "MakingCost", c => c.Single(nullable: false));
            AlterColumn("dbo.FoodItems", "Profit", c => c.Single(nullable: false));
            AlterColumn("dbo.Ingredients", "Quantity", c => c.Single(nullable: false));
            AlterColumn("dbo.Ingredients", "SubTotal", c => c.Single(nullable: false));
            AlterColumn("dbo.Inventories", "UsedQuantity", c => c.Single(nullable: false));
            AlterColumn("dbo.Inventories", "RemainingQuantity", c => c.Single(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Inventories", "RemainingQuantity", c => c.Int(nullable: false));
            AlterColumn("dbo.Inventories", "UsedQuantity", c => c.Int(nullable: false));
            AlterColumn("dbo.Ingredients", "SubTotal", c => c.Int(nullable: false));
            AlterColumn("dbo.Ingredients", "Quantity", c => c.Int(nullable: false));
            AlterColumn("dbo.FoodItems", "Profit", c => c.Int(nullable: false));
            AlterColumn("dbo.FoodItems", "MakingCost", c => c.Int(nullable: false));
        }
    }
}
