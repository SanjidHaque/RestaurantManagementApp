namespace RMS_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class SummaryOfInventoriesAdded : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SummaryOfInventories",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        ItemUsedId = c.String(),
                        ItemUsedName = c.String(),
                        ItemTotal = c.Single(nullable: false),
                        ItemUsedToday = c.Single(nullable: false),
                        ItemRemaining = c.Single(nullable: false),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SummaryOfInventories");
        }
    }
}
