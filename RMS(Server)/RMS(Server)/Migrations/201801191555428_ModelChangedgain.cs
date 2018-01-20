namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModelChangedgain : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.Ingredients", "Unit", c => c.Int(nullable: false));
            AlterColumn("dbo.Inventories", "Unit", c => c.Int(nullable: false));
        }
        
        public override void Down()
        {
            AlterColumn("dbo.Inventories", "Unit", c => c.String());
            DropColumn("dbo.Ingredients", "Unit");
        }
    }
}
