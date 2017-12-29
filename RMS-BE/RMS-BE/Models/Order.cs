using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_BE.Models
{
    public class Order
    {
        public int Id { get; set; }
        public List<OrderItem> OrderItems { get; set; } 
    }
}