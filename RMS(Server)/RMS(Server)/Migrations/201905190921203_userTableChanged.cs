namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userTableChanged : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "CustomPasswordResetToken", c => c.String());
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "CustomPasswordResetToken");
        }
    }
}
