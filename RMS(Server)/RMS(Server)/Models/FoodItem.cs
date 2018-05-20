using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class FoodItem
    {
        public string Id { get; set; }
        public string SerialNo { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public int MakingCost { get; set; }
        public int Profit { get; set; }
        public int TotalSale { get; set; }
        public string FoodItemImage { get; set; }
        public List<Ingredient> Ingredients { get; set; }
     
    }
}