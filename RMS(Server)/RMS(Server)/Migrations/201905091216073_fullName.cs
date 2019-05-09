namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fullName : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "FullName", c => c.String());
            DropColumn("dbo.User", "FirstName");
            DropColumn("dbo.User", "LastName");
        }
        
        public override void Down()
        {
            AddColumn("dbo.User", "LastName", c => c.String());
            AddColumn("dbo.User", "FirstName", c => c.String());
            DropColumn("dbo.User", "FullName");
        }
    }
}
