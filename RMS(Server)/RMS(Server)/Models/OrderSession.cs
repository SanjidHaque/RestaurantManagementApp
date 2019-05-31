using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class OrderSession
    {
        public int Id { get; set; }
        public Order Order { get; set; }
        public int OrderId { get; set; }        
        public List<OrderedItem> OrderedItems { get; set; }
        public string CurrentState { get; set; }
        public string OrderedDateTime { get; set; }
        public string ServedDateTime { get; set; }
    }
}