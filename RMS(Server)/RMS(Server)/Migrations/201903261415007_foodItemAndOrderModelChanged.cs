namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class foodItemAndOrderModelChanged : DbMigration
    {
        public override void Up()
        {
            RenameTable(name: "dbo.InventoryHistoryModels", newName: "InventoryHistories");
            AddColumn("dbo.FoodItems", "FoodItemImageName", c => c.String());
            DropColumn("dbo.FoodItems", "FoodItemImage");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FoodItems", "FoodItemImage", c => c.String());
            DropColumn("dbo.FoodItems", "FoodItemImageName");
            RenameTable(name: "dbo.InventoryHistories", newName: "InventoryHistoryModels");
        }
    }
}
