namespace RestaurantManagementAppBE.Models
{
    public class FoodItem
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public Category Category { get; set; }
        public int CategoryId { get; set; }
    }
}