using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class SetMenuItem
    {
        public string Id { get; set; }
        public SetMenu SetMenu { get; set; }
        public string SetMenuId { get; set; }
        public FoodItem FoodItem { get; set; }
        public string FoodItemId { get; set; }
        public int Quantity { get; set; }
    }
}