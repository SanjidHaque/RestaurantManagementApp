using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class ChangePassword
    {
        public string UserAccountId { get; set; }
        public string OldPassword { get; set; }
        public string NewPassword { get; set; }
    }
}