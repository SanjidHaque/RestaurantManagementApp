using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class InventoryHistory
    {
        public int Id { get; set; }
        public Inventory Inventory { get; set; }
        public int InventoryId { get; set; }
        public int BuyingQuantity { get; set; }
        public string BuyingTime { get; set; }       
        public int BuyingPrice { get; set; }  
    }
}