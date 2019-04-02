namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ingredientModelChanged : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Ingredients", "Name");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Ingredients", "Name", c => c.String());
        }
    }
}
