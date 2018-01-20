using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Ingredient
    {
        public int Id { get; set; }
        public double Quantity { get; set; }
        public int Unit { get; set; }
        public Inventory Inventory { get; set; }
        public int InventoryId { get; set; }
        public FoodItem FoodItem { get; set; }
        public int FooditemId { get; set; }

    }
}