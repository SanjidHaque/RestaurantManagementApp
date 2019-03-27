using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class FoodItem
    {
        public int Id { get; set; }
        public string SerialNumber { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public float InventoryCost { get; set; }
        public float Profit { get; set; }
        public int TotalSale { get; set; }
        public string FoodItemImageName { get; set; }
        public List<Ingredient> Ingredients { get; set; }    
    }
}