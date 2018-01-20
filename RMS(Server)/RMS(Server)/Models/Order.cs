using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Order
    {
        public string Id { get; set; }
        public List<OrderedItems> OrderedItems { get; set; }
        public int TotalPrice { get; set; }
        public int OrderStatus { get; set; }
    }
}