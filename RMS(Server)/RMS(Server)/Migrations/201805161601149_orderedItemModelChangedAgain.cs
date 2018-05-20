namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderedItemModelChangedAgain : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderedItems", "FoodItemSerialNo", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.OrderedItems", "FoodItemSerialNo");
        }
    }
}
