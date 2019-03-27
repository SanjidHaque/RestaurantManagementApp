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
        public int UpdatedQuantity { get; set; }
        public string UpdateTime { get; set; }       
        public int CurrentPrice { get; set; }  
    }
}