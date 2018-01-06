using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class SetMenuItem
    {
        public int Id { get; set; }
        public SetMenu SetMenu { get; set; }
        public int SetMenuId { get; set; }
        public FoodItem FoodItem { get; set; }
        public int FoodItemId { get; set; }
        public int Quantity { get; set; }
    }
}