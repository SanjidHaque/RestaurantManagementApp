using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class InventoryHistoryModel
    {
        public string Id { get; set; }
        public Inventory Inventory { get; set; }
        public string InventoryId { get; set; }
        public int UpdatedQuantity { get; set; }
        public string UpdateTime { get; set; }
        public string Unit { get; set; }    
    }
}