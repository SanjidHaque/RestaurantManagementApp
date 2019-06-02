using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Data.Entity;
using RMS_Server_.Models;


namespace RMS_Server_.Controllers
{
    public class OrderController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private OrderController()
        {
            _context = new ApplicationDbContext();
        }      


        [Route("api/PlaceOrder")]
        [HttpPut]
        public IHttpActionResult PlaceOrder(Order order)
        {
            List<Inventory> inventories = _context.Inventories.ToList();

            foreach (var orderOrderSession in order.OrderSessions)
            {
                if (orderOrderSession.CurrentState == "Not Ordered")
                {
                    foreach (var orderedItem in orderOrderSession.OrderedItems)
                    {
                        FoodItem foodItem = _context.FoodItems.Include(x => x.Ingredients).FirstOrDefault(x => x.Id == orderedItem.FoodItemId);
                        if (foodItem != null)
                        {
                            foreach (var foodItemIngredient in foodItem.Ingredients)
                            {
                                var inventoryQuantity = orderedItem.FoodItemQuantity * foodItemIngredient.Quantity;

                                Inventory inventory =
                                    inventories.FirstOrDefault(x => x.Id == foodItemIngredient.InventoryId);
                                if (inventory != null)
                                {
                                    if (inventoryQuantity > inventory.RemainingQuantity)
                                    {
                                        return Ok( new { Text = "Insufficient inventories"});
                                    }
                                }
                            }
                        }
                    }
                }
            }

            foreach (var orderOrderSession in order.OrderSessions)
            {
                if (orderOrderSession.CurrentState == "Not Ordered")
                {
                    foreach (var orderedItem in orderOrderSession.OrderedItems)
                    {
                        FoodItem foodItem = _context.FoodItems.FirstOrDefault(x => x.Id == orderedItem.FoodItemId);
                        if (foodItem != null)
                        {
                            foreach (var foodItemIngredient in foodItem.Ingredients)
                            {
                                var inventoryQuantity = orderedItem.FoodItemQuantity * foodItemIngredient.Quantity;

                                Inventory inventory =
                                    inventories.FirstOrDefault(x => x.Id == foodItemIngredient.InventoryId);
                                if (inventory != null)
                                {
                                    inventory.RemainingQuantity -= inventoryQuantity;
                                    inventory.UsedQuantity += inventoryQuantity;
                                    _context.SaveChanges();
                                }
                            }

                            foodItem.TotalSale++;
                            _context.SaveChanges();
                        }
                    }
                }
            }

            if (order.Id == -1)
            {
                order.CurrentState = "Ordered";
                _context.Orders.Add(order);
                _context.SaveChanges();
            }
            else
            {
                OrderSession unSavedOrderedSession = order.OrderSessions.FirstOrDefault(x => x.CurrentState == "Not Ordered");
                if (unSavedOrderedSession != null)
                {
                    unSavedOrderedSession.OrderId = order.Id;
                    unSavedOrderedSession.OrderedDateTime = unSavedOrderedSession.OrderedDateTime;
                    _context.OrderSessions.Add(unSavedOrderedSession);
                    _context.SaveChanges();
                }


                Order getExistingOrder = _context.Orders.Include(x => x.Table).FirstOrDefault(x => x.Id == order.Id);
                if (getExistingOrder != null)
                {
                    getExistingOrder.CurrentState =  "Ordered";
                    getExistingOrder.TotalPrice = order.TotalPrice;
                    getExistingOrder.GrossTotalPrice = order.TotalPrice;
                    getExistingOrder.Profit = order.Profit;
                    getExistingOrder.InventoryCost = order.InventoryCost;
                    _context.SaveChanges();
                }
            }

            OrderSession orderSession = order.OrderSessions.FirstOrDefault(x => x.CurrentState == "Not Ordered");

            if (orderSession != null)
            {
                orderSession.CurrentState = "Ordered";
                _context.SaveChanges();
            }


            Order getOrder = _context.Orders.Include(x => x.Table).FirstOrDefault(y => y.Id == order.Id);
            if (getOrder != null)
            {
                getOrder.Table.CurrentState = "Ordered";
            }
            _context.SaveChanges();

            return Ok( new { Text = "Order placed successfully", Order = order });
        }




        [Route("api/CancelOrder")]
        [HttpPut]
        public IHttpActionResult CancelOrder(OrderSession orderSession)
        {
            List<Inventory> inventories = _context.Inventories.ToList();

            foreach (var orderedItem in orderSession.OrderedItems)
            {
                FoodItem foodItem = _context.FoodItems.Include(x => x.Ingredients).FirstOrDefault(x => x.Id == orderedItem.FoodItemId);
                if (foodItem != null)
                {
                    foreach (var foodItemIngredient in foodItem.Ingredients)
                    {
                        var inventoryQuantity = orderedItem.FoodItemQuantity * foodItemIngredient.Quantity;

                        Inventory inventory =
                            inventories.FirstOrDefault(x => x.Id == foodItemIngredient.InventoryId);
                        if (inventory != null)
                        {
                            inventory.RemainingQuantity += inventoryQuantity;
                            inventory.UsedQuantity -= inventoryQuantity;
                        }
                    }

                    foodItem.TotalSale--;
                }
            }

            _context.SaveChanges();

            OrderSession getOrderSession = _context.OrderSessions.FirstOrDefault(x => x.Id == orderSession.Id);
            if (getOrderSession != null)
            {
                _context.OrderSessions.Remove(getOrderSession);
                _context.SaveChanges();
            }

          

            Order order = _context.Orders.Include(x => x.Table).FirstOrDefault(x => x.Id == orderSession.OrderId);

            List<OrderSession> orderSessions = _context.OrderSessions.Include(c => c.Order).ToList();
            List<FoodItem> foodItems = _context.FoodItems.ToList();

            if (order != null)
            {
                orderSession.OrderedItems.ForEach(x =>
                {
                    order.TotalPrice -= x.TotalPrice;
                   

                    FoodItem foodItem = foodItems.FirstOrDefault(y => y.Id == x.FoodItemId);
                    if (foodItem != null)
                    {
                        float totalInventoryCost = x.FoodItemQuantity * foodItem.InventoryCost;
                        order.InventoryCost -= totalInventoryCost;
                    }

                    _context.SaveChanges();
                });

                order.GrossTotalPrice = order.TotalPrice;

                order.Profit = order.TotalPrice - order.InventoryCost;
                order.Table.CurrentState = "Empty";
                _context.SaveChanges();

              
                if (order.OrderSessions == null)
                {
                  
                    _context.Orders.Remove(order);
                    _context.SaveChanges();
                }
                else
                {
                    int lastIndex = order.OrderSessions.Count - 1;
                    order.CurrentState = order.OrderSessions[lastIndex].CurrentState;
                    order.Table.CurrentState = order.CurrentState;
                    _context.SaveChanges();
                }

            }
           
            return Ok();
        }

        [Route("api/ServeOrder")]
        [HttpPut]
        public IHttpActionResult ServeOrder(OrderSession orderSession)
        {
            OrderSession getOrderSession = _context.OrderSessions.FirstOrDefault(x => x.Id == orderSession.Id);
            if (getOrderSession != null)
            {
                getOrderSession.CurrentState = "Served";
                getOrderSession.ServedDateTime = orderSession.ServedDateTime;
                _context.SaveChanges();

                Order order = _context.Orders.Include(y => y.Table).FirstOrDefault(x => x.Id == getOrderSession.OrderId);
                if (order != null)
                {
                    order.CurrentState = "Served";
                    order.Table.CurrentState = "Served";
                    _context.SaveChanges();
                    return Ok("Order served successfully");
                }
            }

            return Ok("Order not found");
        }

        [Route("api/ValidateOrder")]
        [HttpPost]
        [AllowAnonymous]
        public IHttpActionResult ValidateOrder(Order order)
        {

            if (order == null)
            {
                return Ok("Order not found");
            }
            Order getOrder = _context.Orders.Include(x => x.Table).FirstOrDefault(x => x.Id == order.Id);
            List<OrderSession> orderSessions = _context.OrderSessions.Include(c => c.Order).ToList();
            
            if (getOrder == null)
            {
                return Ok("Order not found");
            }

            getOrder.Change = order.Change;
            getOrder.Tendered = order.Tendered;
            getOrder.ServiceChargeAmount = order.ServiceChargeAmount;
            getOrder.VatAmount = order.VatAmount;
            getOrder.CurrentState = "Paid";
            getOrder.DiscountAmount = order.DiscountAmount;
            getOrder.DiscountRate = order.DiscountRate;
            getOrder.DiscountType = order.DiscountType;
            getOrder.SalesPersonName = order.SalesPersonName;
            getOrder.GrossTotalPrice = order.GrossTotalPrice;
            getOrder.DateTime = order.OrderSessions[0].OrderedDateTime;

            getOrder.OrderSessions.ForEach(x =>
            {
                x.CurrentState = "Paid";
            });

            getOrder.Table.CurrentState = "Empty";
            _context.SaveChanges();
            
            return Ok();
        }



        [Route("api/DeleteOrder")]
        [HttpDelete]
        [AllowAnonymous]
        public IHttpActionResult DeleteOrder(int orderId)
        {
            Order deleteOrder = _context.Orders.Include(x => x.Table).FirstOrDefault(a => a.Id == orderId);
            if (deleteOrder != null)
            {
                deleteOrder.Table.CurrentState = "Empty";
                _context.Orders.Remove(deleteOrder);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }
           
        [HttpGet]
        [AllowAnonymous]
        [Route("api/GetAllOrder")]
        public IHttpActionResult GetAllOrder()
        {

            List<Order> orders = _context.Orders.Include(x => x.OrderSessions)
                .OrderByDescending(y => y.Id)
                .ToList();
            List<OrderedItem> orderedItems = _context.OrderedItems.Include(c => c.OrderSession).ToList();
            return Ok(orders);
        }

    }
}
