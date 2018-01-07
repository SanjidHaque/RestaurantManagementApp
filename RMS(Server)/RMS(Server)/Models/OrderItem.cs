﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class OrderItem
    {
        public int Id { get; set; }
        public string OrderItemId { get; set; }
        public FoodItem FoodItem { get; set; }
        public int? FoodItemId { get; set; }
        public SetMenu SetMenu { get; set; }
        public int? SetMenuId { get; set; }
        public string SetMenuName { get; set; }
        public int Price { get; set; }
        public int Quantity { get; set; }
    }
}