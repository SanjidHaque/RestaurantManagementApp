using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace RMS_Server_.Models
{
    public class ForgotPassword
    {
        public string UserName { get; set; }
        public string Id { get; set; }
        public string NewPassword { get; set; }

    }
}