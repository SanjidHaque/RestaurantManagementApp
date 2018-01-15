namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class OrderedItemModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderedItems", "SetMenuQuantity", c => c.Int());
            AddColumn("dbo.OrderedItems", "FoodItemQuantity", c => c.Int());
            AddColumn("dbo.OrderedItems", "FoodItemName", c => c.String());
            AddColumn("dbo.OrderedItems", "SetMenuSubTotal", c => c.Int());
            AddColumn("dbo.OrderedItems", "FoodItemSubTotal", c => c.Int());
            DropColumn("dbo.OrderedItems", "Quantity");
            DropColumn("dbo.OrderedItems", "SubTotal");
        }
        
        public override void Down()
        {
            AddColumn("dbo.OrderedItems", "SubTotal", c => c.Int(nullable: false));
            AddColumn("dbo.OrderedItems", "Quantity", c => c.Int(nullable: false));
            DropColumn("dbo.OrderedItems", "FoodItemSubTotal");
            DropColumn("dbo.OrderedItems", "SetMenuSubTotal");
            DropColumn("dbo.OrderedItems", "FoodItemName");
            DropColumn("dbo.OrderedItems", "FoodItemQuantity");
            DropColumn("dbo.OrderedItems", "SetMenuQuantity");
        }
    }
}
