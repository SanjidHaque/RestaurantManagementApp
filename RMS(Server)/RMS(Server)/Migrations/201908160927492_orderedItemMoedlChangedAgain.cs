namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class orderedItemMoedlChangedAgain : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.OrderedItems", "CurrentState", c => c.String());
            DropColumn("dbo.OrderedItems", "Status");
        }
        
        public override void Down()
        {
            AddColumn("dbo.OrderedItems", "Status", c => c.String());
            DropColumn("dbo.OrderedItems", "CurrentState");
        }
    }
}
