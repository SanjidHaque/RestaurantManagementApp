using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RestaurantManagementAppBE.Models;

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

            var foodItem = _Context.FoodItems.ToList();
            var menu = new MenuViewModel {FoodItems = foodItem};
            return menu;
        }

        
    }
}
