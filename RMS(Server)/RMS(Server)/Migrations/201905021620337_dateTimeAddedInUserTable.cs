namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class dateTimeAddedInUserTable : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "AddingDateTime", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "AddingDateTime");
        }
    }
}
