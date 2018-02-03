using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
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
            _context.OrderedItems.AddRange(orders.OrderedItems);
            _context.Orders.Add(orders);
            _context.SaveChanges();
        }
                
             
            
 
            
         //   var apiOrder = new Order();
         //   apiOrder.Id = orders.Id;
         //   apiOrder.OrderStatus = orders.OrderStatus;
         //   apiOrder.TotalPrice = orders.TotalPrice;
         //   for(int i = 0; i < orders.OrderedItems.Count; i++)
         //   {
         //       var apiOrderedItems = new OrderedItems();
         //       apiOrderedItems.OrderItemId = orders.OrderedItems[i].OrderItemId;
         //       apiOrderedItems.OrderId = orders.OrderedItems[i].OrderId;
         //       apiOrderedItems.Price = orders.OrderedItems[i].Price;
         //       apiOrderedItems.SetMenuQuantity = orders.OrderedItems[i].SetMenuQuantity;
         //       apiOrderedItems.SetMenuId = orders.OrderedItems[i].SetMenuId;
         //       apiOrderedItems.SetMenuName = orders.OrderedItems[i].SetMenuName;
         //       apiOrderedItems.SetMenuSubTotal = orders.OrderedItems[i].SetMenuSubTotal;
         //       apiOrderedItems.FoodItemId = orders.OrderedItems[i].FoodItemId;
         //       apiOrderedItems.FoodItemQuantity = orders.OrderedItems[i].FoodItemQuantity;
         //       apiOrderedItems.FoodItemSubTotal = orders.OrderedItems[i].FoodItemSubTotal;
         //       apiOrderedItems.FoodItemName = orders.OrderedItems[i].FoodItemName;
         //      // apiOrderedItems.FoodItemId = orders.OrderedItems[i].FoodItemId;
         //       _context.OrderedItems.Add(apiOrderedItems);
         //       _context.SaveChanges();
         //   }
         ////   _context.OrderedItems.AddRange(orders.OrderedItems);
         //  // _context.Orders.Add(orders);
         //   _context.Orders.Add(apiOrder);
            

         //   _context.SaveChanges();

        
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
            var acceptedOrder = _context.Orders.FirstOrDefault(p => p.Id == order.Id);
            acceptedOrder.OrderStatus = 1;
            _context.SaveChanges();

            var orderedItems = _context.OrderedItems.Where(p => p.OrderId == order.Id).ToList();

            for (int i = 0; i < orderedItems.Count; i++)
            {

                var getFoodItemId = acceptedOrder.OrderedItems[i].FoodItemId;
                var getIngredient = _context.Ingredients.Where(p => p.FooditemId == getFoodItemId).ToList();
                for (int j = 0; j < getIngredient.Count; j++)
                {
                    var getInventoryId = getIngredient[j].InventoryId;
                    var getInventory = _context.Inventories.FirstOrDefault(p => p.Id == getInventoryId);
                    getInventory.Quantity -= getIngredient[j].Quantity;
                    _context.SaveChanges();


                    var sumOfInv = _context.SummaryOfInventories.FirstOrDefault(p => p.InventoryId == getInventoryId);
                    sumOfInv.ItemUsedName = getInventory.Name;

                    sumOfInv.ItemUsedToday += getIngredient[j].Quantity;
                    sumOfInv.ItemRemaining = sumOfInv.ItemTotal - sumOfInv.ItemUsedToday;
                    _context.SaveChanges();
                }


            }

            var cashFlow = new CashFlow();
            cashFlow.OrderId = order.Id;
            cashFlow.OrderPrice = order.TotalPrice;


            var getFoodItemList = _context.OrderedItems.Where(p => p.OrderId == order.Id).ToList();
            for (int i = 0; i < getFoodItemList.Count; i++)
            {
                var getCertainFoodItemId = getFoodItemList[i].FoodItemId;
                if (getCertainFoodItemId != null)
                {
                    var getIngList = _context.Ingredients.Where(p => p.FooditemId == getCertainFoodItemId).ToList();
                    for (int j = 0; j < getIngList.Count; j++)
                    {
                        var getInvId = getIngList[j].InventoryId;
                        var getInvRow = _context.Inventories.FirstOrDefault(p => p.Id == getInvId);
                        var invPrice = getInvRow.Price;
                        var ingSubTotal = getIngList[j].Quantity*invPrice;

                        cashFlow.InventoryCost += System.Math.Round(ingSubTotal, 2);
                    }
                }
            }
            for (int i = 0; i < getFoodItemList.Count; i++)
            {
                var getCertainSetMenuId = getFoodItemList[i].SetMenuId;
                if (getCertainSetMenuId != null)
                {
                    var setMenuList = _context.SetMenuItems.Where(p => p.SetMenuId == getCertainSetMenuId).ToList();
                    for (int j = 0; j < setMenuList.Count; j++)
                    {
                        var getFoodItemId = setMenuList[j].FoodItemId;
                        var getIngList = _context.Ingredients.Where(p => p.FooditemId
                                                                         == getFoodItemId).ToList();

                        for (int k = 0; k < getIngList.Count; k++)
                        {
                            var getInvId = getIngList[k].InventoryId;
                            var getInvRow = _context.Inventories.FirstOrDefault(p => p.Id == getInvId);
                            var invPrice = getInvRow.Price;
                            var ingSubTotal = getIngList[k].Quantity*invPrice;
                            cashFlow.InventoryCost += System.Math.Round(ingSubTotal, 2);
                        }
                    }
                }
            }

            var profit = cashFlow.OrderPrice - cashFlow.InventoryCost;
            cashFlow.Profit = System.Math.Round(profit, 2);
            _context.CashFlows.Add(cashFlow);
            _context.SaveChanges();
        }


        [HttpGet]
        [Route("api/GetCashFlow")]
        public List<CashFlow> CashFlow()
        {
            return _context.CashFlows.ToList();
        }



        [HttpGet]
        [Route("api/GetSummaryOfInventories")]
        public List<SummaryOfInventory> SummaryOfInventories()
        {
            return _context.SummaryOfInventories.Include(c => c.Inventory).ToList();
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
            var getOrderId =
                _context.OrderedItems.Where(p => p.FoodItemId == foodItem.Id).ToList();
            
                for (int k = 0; k < getOrderId.Count; k++)
                {
                    if (getOrderId[k] != null)
                    {
                        var orderId = getOrderId[k].OrderId;

                        var deleteOrderedItemsRelatedToThisFoodItem =
                            _context.OrderedItems.Where(p => p.OrderId == orderId).ToList();


                        _context.OrderedItems.RemoveRange(deleteOrderedItemsRelatedToThisFoodItem);

                        var deleteOrderRelatedToThisFoodItem =
                            _context.Orders.FirstOrDefault(p => p.Id == orderId);
                        _context.Orders.Remove(deleteOrderRelatedToThisFoodItem);
                        _context.SaveChanges();
                    }
                    var deleteIngredients = _context.Ingredients.Where(p => p.FooditemId == foodItem.Id).ToList();
                    _context.Ingredients.RemoveRange(deleteIngredients);
                    var deleteFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItem.Id);
                    _context.FoodItems.Remove(deleteFoodItem);
                    _context.SaveChanges();
 
                }
            
              }

        [HttpGet]
        [Route("api/GetInventories")]
        public List<Inventory> GetInventories()
        {
            return _context.Inventories.ToList();
        }

        [HttpPost]
        [Route("api/AddNewInventory")]
        public void AddInventoryItem(Inventory inventory)
        {
            try
            {
                _context.Inventories.Add(inventory);
                var sumOfInv = new SummaryOfInventory();
                sumOfInv.InventoryId = inventory.Id;
                sumOfInv.ItemTotal = inventory.Quantity;
                sumOfInv.Unit = inventory.Unit;
                _context.SummaryOfInventories.Add(sumOfInv);
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
        }

        [HttpPost]
        [Route("api/EditInventoryItem")]
        public void EditInventoryItem(Inventory inventory)
        {
            try
            {
                var getEdited = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
                getEdited.Name = inventory.Name;
                getEdited.Price = inventory.Price;
                getEdited.Quantity = inventory.Quantity;
                getEdited.Unit = inventory.Unit;
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
        }



        [HttpPost]
        [Route("api/DeleteInventoryItem")]
        public void DeleteInventoryItem(Inventory inventory)
        {
            try
            {
                var getIngredientsDeleted = _context.Ingredients.Where(p => p.InventoryId == inventory.Id).ToList();
                _context.Ingredients.RemoveRange(getIngredientsDeleted);
                var getDeleted = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
                _context.Inventories.Remove(getDeleted);
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
        }

        [HttpPost]
        [Route("api/AddFoodItem")]
        public void AddFoodItem(FoodItem foodItem)
        {
            try
            {  
                _context.Ingredients.AddRange(foodItem.Ingredients);
                _context.FoodItems.Add(foodItem);
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
        }



        

        [HttpPost]
        [Route("api/AddSetMenu")]
        public void AddSetMenu(SetMenu setMenu)
        {
            _context.SetMenus.Add(setMenu);
            _context.SaveChanges();
        }


      /*  public void CalculateInventories()
        {
            List<SummaryOfInventory> dataList = new List<SummaryOfInventory>();
            
            var totalOrderedItems = _context.OrderedItems.ToList();

            var i = 0;
            foreach (var totalOrderedItem in totalOrderedItems)
            {
                var id = totalOrderedItems[i].FoodItem.Ingredients
                var inventoryId = totalOrderedItems.
                dataList.Add(new SummaryOfInventory { ItemUsedId = ""});
            }
        }
*/
       /* public List<SummaryOfInventory> SummaryOfInventories()
        {
            var totalOrderedItems = _context.OrderedItems.ToList();

            foreach (var totalOrderedItem in totalOrderedItems)
            {
                
            }

        }*/
    }
}
