using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class MenuViewModel
    {
        public List<SetMenu> SetMenus { get; set; }
        public List<FoodItem> FoodItems { get; set; }
    }
}