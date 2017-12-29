using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using RMS_BE.Models;
using System.Data.Entity;
using System.Web.Http.Cors;



namespace RMS_BE.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]
    public class RestaurantManagementAppController : ApiController
    {
        public ApplicationDbContext _Context;

        public RestaurantManagementAppController()
        {
            _Context = new ApplicationDbContext();
        }

        [Route("api/menu")]
        [HttpGet]
        public MenuViewModel Menu()
        {

            var foodItem = _Context.FoodItems.ToList();
            var setMenu = _Context.SetMenus.Include(a => a.SetMenuItems).ToList();
            var menu = new MenuViewModel {FoodItems = foodItem, SetMenus = setMenu,};
            return menu;
        }
        [Route("api/PostMenu")]
        [HttpPost]
        public void PostMenu(OrderItem orderItem)
        {
            _Context.OrderItems.Add(orderItem);
            _Context.SaveChanges();
        }

    }
}



