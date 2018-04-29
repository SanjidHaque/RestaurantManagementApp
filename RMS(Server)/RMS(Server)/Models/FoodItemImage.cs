using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class FoodItemImage
    {
        public int Id { get; set; }
        public string FoodItemId { get; set; }
        public string ImagePath { get; set; }
    }
}