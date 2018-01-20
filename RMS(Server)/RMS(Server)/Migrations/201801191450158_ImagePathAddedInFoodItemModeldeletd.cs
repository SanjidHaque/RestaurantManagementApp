namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ImagePathAddedInFoodItemModeldeletd : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.FoodItems", "ImagePath");
        }
        
        public override void Down()
        {
            AddColumn("dbo.FoodItems", "ImagePath", c => c.String());
        }
    }
}
