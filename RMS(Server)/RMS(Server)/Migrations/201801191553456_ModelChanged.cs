namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModelChanged : DbMigration
    {
        public override void Up()
        {
            AlterColumn("dbo.Ingredients", "Quantity", c => c.Double(nullable: false));
            AlterColumn("dbo.Inventories", "Quantity", c => c.Double(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Inventories", "Quantity", c => c.Int(nullable: false));
            AlterColumn("dbo.Ingredients", "Quantity", c => c.Int(nullable: false));
        }
    }
}
