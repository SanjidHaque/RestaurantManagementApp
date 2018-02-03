using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class CashFlow
    {
        public int Id { get; set; }
        public Order Order { get; set; }
        public string OrderId { get; set; }
        public int OrderPrice { get; set; }
        public double InventoryCost { get; set; }
        public double Profit { get; set; }
        public Inventory Inventory { get; set; }
        public string InventoryId { get; set; }
    }
}