using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class FoodItem
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public List<Ingredient> Ingredients { get; set; }
        public string FooditemImage { get; set; }
    }
}