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
        public void PostMenu(Order orders)
        {
            var apiOrder = new Order();
            apiOrder.Id = orders.Id;
            apiOrder.IsServed = orders.IsServed;
            apiOrder.TotalPrice = orders.TotalPrice;
            for(int i = 0; i < orders.OrderedItems.Count; i++)
            {
                var apiOrderedItems = new OrderedItems();
                apiOrderedItems.Id = orders.OrderedItems[i].Id;
                apiOrderedItems.OrderId = orders.OrderedItems[i].OrderId;
                apiOrderedItems.Price = orders.OrderedItems[i].Price;
                apiOrderedItems.Quantity = orders.OrderedItems[i].Quantity;
                apiOrderedItems.SetMenuId = orders.OrderedItems[i].SetMenuId;
                apiOrderedItems.SetMenuName = orders.OrderedItems[i].SetMenuName;
                apiOrderedItems.SubTotal = orders.OrderedItems[i].SubTotal;
                apiOrderedItems.FoodItemId = orders.OrderedItems[i].FoodItemId;
                _context.OrderedItems.Add(apiOrderedItems);
            }
           /* _context.OrderedItems.AddRange(orders.OrderedItems);*/
                        _context.Orders.Add(apiOrder);
                    //    _context.SaveChanges();

            _context.SaveChanges();
        }
     

    }
}
