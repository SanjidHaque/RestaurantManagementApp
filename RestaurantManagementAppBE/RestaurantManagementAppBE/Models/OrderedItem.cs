using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RestaurantManagementAppBE.Models
{
    public class OrderedItem
    {

        public Guid Id { get; set; }
        public int Quantity { get; set; }
        public Guid OrderId { get; set; }
        public Order Order { get; set; }
        public FoodItem FoodItem { get; set; }
        public int? FoodItemId { get; set; }
        public SetMenu SetMenu { get; set; }
        public int? SetMenuId { get; set; }
    }
}