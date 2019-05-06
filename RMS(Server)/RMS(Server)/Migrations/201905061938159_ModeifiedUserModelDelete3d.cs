namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class ModeifiedUserModelDelete3d : DbMigration
    {
        public override void Up()
        {
            DropTable("dbo.ModifiedUsers");
        }
        
        public override void Down()
        {
            CreateTable(
                "dbo.ModifiedUsers",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        UserName = c.String(),
                        Email = c.String(),
                        Role = c.String(),
                        DateTime = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
    }
}
