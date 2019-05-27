namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderedItemModelChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderedItems", "TotalPrice", c => c.Int(nullable: false));
            DropColumn("dbo.OrderedItems", "SubTotal");
        }
        
        public override void Down()
        {
            AddColumn("dbo.OrderedItems", "SubTotal", c => c.Int(nullable: false));
            DropColumn("dbo.OrderedItems", "TotalPrice");
        }
    }
}
