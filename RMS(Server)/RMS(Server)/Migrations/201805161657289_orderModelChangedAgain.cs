namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderModelChangedAgain : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.OrderedItems", "FoodItemQuantity", c => c.Int(nullable: false));
            AlterColumn("dbo.OrderedItems", "FoodItemSubTotal", c => c.Int(nullable: false));
            AlterColumn("dbo.OrderedItems", "FoodItemMakingCost", c => c.Int(nullable: false));
            DropColumn("dbo.Orders", "OrderStatus");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Orders", "OrderStatus", c => c.Int(nullable: false));
            AlterColumn("dbo.OrderedItems", "FoodItemMakingCost", c => c.Int());
            AlterColumn("dbo.OrderedItems", "FoodItemSubTotal", c => c.Int());
            AlterColumn("dbo.OrderedItems", "FoodItemQuantity", c => c.Int());
        }
    }
}
