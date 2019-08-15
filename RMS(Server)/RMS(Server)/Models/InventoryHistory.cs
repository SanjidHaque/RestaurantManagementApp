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
        public float Quantity { get; set; }
        public string DateTime { get; set; }       
        public float Price { get; set; }
        public string Type { get; set; }
        public string Comment { get; set; }  
    }
}   