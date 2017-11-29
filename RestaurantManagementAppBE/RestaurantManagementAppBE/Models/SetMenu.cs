using System.Collections.Generic;

namespace RestaurantManagementAppBE.Models
{
    public class SetMenu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public List<SetMenuItem> SetMenuItems { get; set; }
    }
}