using System;
using System.Collections.Generic;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;
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
            try
            {
                _context.OrderedItems.AddRange(orders.OrderedItems);
                _context.Orders.Add(orders);
                _context.SaveChanges();
            }
            catch (DbEntityValidationException e)
            {
                foreach (var eve in e.EntityValidationErrors)
                {
                    Console.WriteLine("Entity of type \"{0}\" in state \"{1}\" has the following validation errors:",
                        eve.Entry.Entity.GetType().Name, eve.Entry.State);
                    foreach (var ve in eve.ValidationErrors)
                    {
                        Console.WriteLine("- Property: \"{0}\", Error: \"{1}\"",
                            ve.PropertyName, ve.ErrorMessage);
                    }
                }
                throw;
            }

            
           /* var apiOrder = new Order();
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
            }*/
            //_context.OrderedItems.AddRange(orders.OrderedItems);
            //_context.Orders.Add(orders);
                      //  _context.Orders.Add(apiOrder);
                    //    _context.SaveChanges();

            //_context.SaveChanges();
        }
        [HttpGet]
        [Route("api/GetOrders")]
        public List<Order> Order()
        {
            return _context.Orders.Where(p => p.OrderStatus == 0).Include(b => b.OrderedItems).ToList();
        }

        [HttpPost]
        [Route("api/AcceptOrders")]
        public void OrderAccepted(Order order)
        {
             var acceptedOrder =  _context.Orders.FirstOrDefault(p => p.Id == order.Id);
              acceptedOrder.OrderStatus = 1;
             _context.SaveChanges();
        }
        [HttpPost]
        [Route("api/RejectOrders")]
        public void OrderRejected(Order order)
        {
            var rejectedOrder = _context.Orders.FirstOrDefault(p => p.Id == order.Id);
            rejectedOrder.OrderStatus = 2;
            _context.SaveChanges();
        }

        [HttpPost]
        [Route("api/AddNewFoodItem")]
        public void FoodItemAdd(FoodItem foodItem)
        {
            _context.FoodItems.Add(foodItem);
            _context.SaveChanges();
        }


        [HttpPost]
        [Route("api/EditFoodItem")]
        public void FoodItemEdit(FoodItem foodItem)
        {
            var editedFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItem.Id);
            editedFoodItem.Name = foodItem.Name;
            editedFoodItem.Price = foodItem.Price;
            _context.SaveChanges();
        }

        [HttpPost]
        [Route("api/DeleteFoodItem")]
        public void FoodItemDelete(FoodItem foodItem)
        {
            var editedFoodItem = _context.FoodItems.FirstOrDefault(p => p.Name == foodItem.Name);
            _context.FoodItems.Remove(editedFoodItem);
            _context.SaveChanges();
        }
    }
}
