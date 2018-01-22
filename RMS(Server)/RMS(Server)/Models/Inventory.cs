using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Inventory
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public double Quantity { get; set; }
        public int Unit { get; set; }
        public int Price { get; set; }
    }
}