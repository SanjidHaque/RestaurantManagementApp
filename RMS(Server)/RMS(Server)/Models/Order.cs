using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Order
    {
        public int Id { get; set; }
        public List<OrderSession> OrderSessions { get; set; }
        public int? TotalPrice { get; set; }
        public int? GrossTotalPrice { get; set; }
        public int? Tendered { get; set; }
        public int? Change { get; set; }
        public string DateTime { get; set; }
        public float? InventoryCost { get; set; }
        public float? Profit { get; set; }
        public Table Table { get; set; }
        public int TableId { get; set; }
        public string CurrentState { get; set; }
        public float? VatAmount { get; set; }
        public float? ServiceChargeAmount { get; set; }
        public string DiscountType { get; set; }
        public float? DiscountRate { get; set; }    
        public float? DiscountAmount { get; set; }
        public string SalesPersonName { get; set; }    
    }
}