using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RestaurantManagementAppBE.Models
{
    public class Order
    {
        public Guid Id { get; set; }
        public List<OrderedItem> OrderItems { get; set; }
    }
}