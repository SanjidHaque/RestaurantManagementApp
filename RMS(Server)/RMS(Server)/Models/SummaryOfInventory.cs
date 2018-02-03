using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class SummaryOfInventory
    {
        public int Id { get; set; }
        public string ItemUsedName { get; set; }
        public double ItemTotal { get; set; }
        public double ItemUsedToday { get; set; }
        public double ItemRemaining { get; set; }
        public Inventory Inventory { get; set; }
        public string InventoryId { get; set; }
        public int Unit { get; set; }
    }
}