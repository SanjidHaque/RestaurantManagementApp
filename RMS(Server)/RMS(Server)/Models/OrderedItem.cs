namespace RMS_Server_.Models
{
    public class OrderedItem
    {
        public int Id { get; set; }
        public OrderSession OrderSession { get; set; }
        public int OrderSessionId { get; set; } 
        public FoodItem FoodItem { get; set; }
        public int FoodItemId { get; set; }
        public int FoodItemQuantity { get; set; }
        public int TotalPrice { get; set; }
        public string CurrentState { get; set; }
        public string CancellationReason { get; set; } 
    }
}