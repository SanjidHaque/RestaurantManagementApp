namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userTableChangedAgainAgainAgainAgain : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime", c => c.DateTime());
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime");
        }
    }
}
