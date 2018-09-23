using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Ingredient
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
        public float Quantity { get; set; }
        public string Unit { get; set; }
        public Inventory Inventory { get; set; }
        public string InventoryId { get; set; }
        public int InventoryPrice { get; set; }
        public float SubTotal { get; set; }
        public FoodItem FoodItem { get; set; }
        public string FooditemId { get; set; }
    }
}