using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class OrderedItems
    {
        [Key]
        public string OrderItemId { get; set; }
        public Order Order { get; set; }
        public string OrderId { get; set; }
        public FoodItem FoodItem { get; set; }
        public int? FoodItemId { get; set; }
        public int? SetMenuQuantity { get; set; }
        public int? FoodItemQuantity { get; set; }
        public SetMenu SetMenu { get; set; }
        public int? SetMenuId { get; set; }
        public string SetMenuName { get; set; }
        public string FoodItemName { get; set; }
        public int Price { get; set; }
        public int? SetMenuSubTotal { get; set; }
        public int? FoodItemSubTotal { get; set; }
    }
}