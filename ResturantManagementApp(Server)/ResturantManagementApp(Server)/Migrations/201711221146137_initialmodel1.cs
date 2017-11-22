namespace ResturantManagementApp_Server_.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class initialmodel1 : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.SetMenuIngredients",
                c => new
                    {
                        Id = c.Int(nullable: false, identity: true),
                        FoodName1 = c.String(),
                        FoodName2 = c.String(),
                        FoodName3 = c.String(),
                    })
                .PrimaryKey(t => t.Id);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.SetMenuIngredients");
        }
    }
}
