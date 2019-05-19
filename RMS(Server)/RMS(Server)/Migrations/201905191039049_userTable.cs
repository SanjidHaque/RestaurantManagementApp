namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userTable : DbMigration
    {
        public override void Up()
        {
            DropColumn("dbo.User", "CustomPasswordResetToken");
            DropColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime");
        }
        
        public override void Down()
        {
            AddColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime", c => c.DateTime());
            AddColumn("dbo.User", "CustomPasswordResetToken", c => c.String());
        }
    }
}
