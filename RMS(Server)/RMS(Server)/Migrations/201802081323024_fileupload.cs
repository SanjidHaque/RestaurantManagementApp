namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class fileupload : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.FileUploads",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        CourseFile = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.FileUploads");
        }
    }
}
