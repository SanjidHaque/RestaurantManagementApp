namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class userTableSuperNew : DbMigration
    {
        public override void Up()
        {
            AddColumn("dbo.User", "CustomPasswordResetToken", c => c.String());
            AddColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime", c => c.DateTime(nullable: false));
        }
        
        public override void Down()
        {
            DropColumn("dbo.User", "CustomPasswordResetTokenIssuedDateTime");
            DropColumn("dbo.User", "CustomPasswordResetToken");
        }
    }
}
