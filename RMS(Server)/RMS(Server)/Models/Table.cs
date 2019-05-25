using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Table
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string CurrentState { get; set; }
        public List<Order> Orders { get; set; }
    }   
}