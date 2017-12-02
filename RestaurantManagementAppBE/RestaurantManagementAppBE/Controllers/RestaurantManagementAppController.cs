using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RestaurantManagementAppBE.Models;
using System.Data.Entity;

namespace RestaurantManagementAppBE.Controllers
{
    public class RestaurantManagementAppController : ApiController
    {
        public MyDbContext _Context;

        public RestaurantManagementAppController()
        {
            _Context = new MyDbContext();
        }
        [Route("api/menu")]
        [HttpGet]
        public MenuViewModel Menu()
        {

            var foodItem = _Context.FoodItems.GroupBy(p=>p.Category).ToDictionary(p=>p.Key.Name, p=>p.ToList());
            var setMenu = _Context.SetMenus.Include(a => a.SetMenuItems).ToList();
            var menu = new MenuViewModel {  SetMenus = setMenu, FoodCategories = foodItem};
            return menu;
        }
        
        
    }
}
