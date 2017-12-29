using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_BE.Models
{
    public class SetMenu
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public int Price { get; set; }
        public List<SetMenuItem> SetMenuItems { get; set; }
    }
}