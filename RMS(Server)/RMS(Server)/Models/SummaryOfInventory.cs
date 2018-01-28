using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class SummaryOfInventory
    {
        public int Id { get; set; }
        public string ItemUsedId { get; set; }
        public string ItemUsedName { get; set; }
        public float ItemTotal { get; set; }
        public float ItemUsedToday { get; set; }
        public float ItemRemaining { get; set; }
    }
}