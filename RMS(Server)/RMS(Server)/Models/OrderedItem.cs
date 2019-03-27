using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class OrderedItem
    {
        public int Id { get; set; }
        public Order Order { get; set; }
        public int OrderId { get; set; }
        public FoodItem FoodItem { get; set; }
        public int FoodItemId { get; set; }
        public int FoodItemQuantity { get; set; }
        public int SubTotal { get; set; }
    }
}