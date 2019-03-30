using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Inventory
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public float UsedQuantity { get; set; }
        public float RemainingQuantity { get; set; }  
        public string Unit { get; set; }
        public int AveragePrice { get; set; }
        public List<InventoryHistory> InventoryHistory { get; set; }
        public string BuyingTime { get; set; }
    }
}