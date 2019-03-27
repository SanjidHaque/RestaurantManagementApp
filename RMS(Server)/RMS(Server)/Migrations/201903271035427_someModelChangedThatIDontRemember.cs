namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class someModelChangedThatIDontRemember : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.Ingredients", "Unit");
        }
        
        public override void Down()
        {
            AddColumn("dbo.Ingredients", "Unit", c => c.String());
        }
    }
}
