namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderedItemModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderedItems", "OrderedItemStatus", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.OrderedItems", "OrderedItemStatus");
        }
    }
}
