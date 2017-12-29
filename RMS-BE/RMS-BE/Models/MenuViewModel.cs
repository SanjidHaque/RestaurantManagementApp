using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_BE.Models
{
    public class MenuViewModel
    {
        public List<SetMenu> SetMenus { get; set; }
<<<<<<< HEAD:RestaurantManagementAppBE/RestaurantManagementAppBE/Models/MenuViewModel.cs
        public Dictionary<string, List<FoodItem>> FoodCategories { get; set; }
=======
        public List<FoodItem> FoodItems { get; set; }

>>>>>>> Sanjid-Haque:RMS-BE/RMS-BE/Models/MenuViewModel.cs
    }
}