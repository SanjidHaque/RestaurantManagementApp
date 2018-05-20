namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class modelChanged2 : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.ModifiedUsers", "DateTime", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.ModifiedUsers", "DateTime");
        }
    }
}
