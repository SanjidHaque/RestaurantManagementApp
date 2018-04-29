using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class Table
    {
        [Key]
        public string Id { get; set; }
        public string Name { get; set; }
    }
}