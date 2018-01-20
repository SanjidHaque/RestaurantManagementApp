namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ImagePathAddedInFoodItemModel : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.FoodItems", "ImagePath", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.FoodItems", "ImagePath");
        }
    }
}
