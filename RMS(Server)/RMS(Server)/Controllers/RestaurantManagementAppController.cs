using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Data.Entity;
using RMS_Server_.Models;
using System.Web.Http.Cors;


namespace RMS_Server_.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]  
    public class RestaurantManagementAppController : ApiController
    {
        
   
        private ApplicationDbContext _context;

        private RestaurantManagementAppController()
        {
            _context = new ApplicationDbContext();
        }
        [Route("api/menu")]
        [HttpGet]
        public MenuViewModel Menu()
        {

            var foodItem = _context.FoodItems.ToList();
            var setMenu = _context.SetMenus.Include(a => a.SetMenuItems).ToList();
            var menu = new MenuViewModel { FoodItems = foodItem, SetMenus = setMenu, };
            return menu;
        }

        [Route("api/PostMenu")]
        [HttpPost]
        public void PostMenu(List<OrderItem> orderItems)
        {
        
            _context.OrderItems.AddRange(orderItems);
            _context.SaveChanges();
        }
     

    }
}
