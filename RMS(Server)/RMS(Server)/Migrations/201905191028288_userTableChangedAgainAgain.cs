namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userTableChangedAgainAgain : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime", c => c.String());
        }
    }
}
