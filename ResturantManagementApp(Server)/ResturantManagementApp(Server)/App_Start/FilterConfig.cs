using System.Web;
using System.Web.Mvc;

namespace ResturantManagementApp_Server_
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
