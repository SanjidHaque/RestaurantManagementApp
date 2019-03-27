using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string ReceiptNumber { get; set; }
        public List<OrderedItem> OrderedItem { get; set; }
        public int TotalPrice { get; set; }
        public int Tendered { get; set; }
        public int Change { get; set; }
        public string DateTime { get; set; }
        public string TableNumber { get; set; }
        public float InventoryCost { get; set; }
        public float Profit { get; set; }
    }
}