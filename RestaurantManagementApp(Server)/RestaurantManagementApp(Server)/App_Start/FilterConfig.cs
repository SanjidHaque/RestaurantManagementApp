using System.Web;
using System.Web.Mvc;

namespace RestaurantManagementApp_Server_
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
