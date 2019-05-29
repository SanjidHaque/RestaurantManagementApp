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
        [HttpPost]
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
                                }
                            }

                            foodItem.TotalSale++;
                        }
                    }
                }
            }

            if (order.Id == -1)
            {
                _context.Orders.Add(order);
            }
            else
            {
                OrderSession unSavedOrderedSession = order.OrderSessions.FirstOrDefault(x => x.CurrentState == "Not Ordered");
                if (unSavedOrderedSession != null)
                {
                    unSavedOrderedSession.OrderId = order.Id;
                    _context.OrderSessions.Add(unSavedOrderedSession);
                    _context.SaveChanges();
                }
               
            }

            OrderSession orderSession = order.OrderSessions.FirstOrDefault(x => x.CurrentState == "Not Ordered");

            if (orderSession != null && order.Id != -1)
            {
                orderSession.CurrentState = "Ordered";
                orderSession.OrderedItems.ForEach(x =>
                {
                   order.TotalPrice +=  x.TotalPrice;
                });
            }


            Table table = _context.Tables.FirstOrDefault(x => x.Id == order.TableId);
            if (table != null)
            {
                table.CurrentState = "Ordered";
            }

            order.CurrentState = "Ordered";
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

            OrderSession getOrderSession = _context.OrderSessions.FirstOrDefault(x => x.Id == orderSession.Id);
            if (getOrderSession != null)
            {
                _context.OrderSessions.Remove(getOrderSession);
                _context.SaveChanges();
            }

          

            Order order = _context.Orders.Include(x => x.OrderSessions).FirstOrDefault(x => x.Id == orderSession.OrderId);
            if (order != null)
            {
                orderSession.OrderedItems.ForEach(x =>
                {
                    order.TotalPrice -= x.TotalPrice;
                });

                Table table = _context.Tables.FirstOrDefault(x => x.Id == order.TableId);
                if (order.OrderSessions.Count == 0)
                {
                    if (table != null)
                    {
                        table.CurrentState = "Empty";
                    }
                    _context.Orders.Remove(order);

                    _context.SaveChanges();
                }
                else
                {
                    int lastIndex = order.OrderSessions.Count - 1;
                    order.CurrentState = order.OrderSessions[lastIndex].CurrentState;

                    
                    if (table != null)
                    {
                        table.CurrentState = order.CurrentState;
                    }
                }

            }

            
            _context.SaveChanges();
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
                Order order = _context.Orders.FirstOrDefault(x => x.Id == getOrderSession.OrderId);
                if (order != null)
                {
                    order.CurrentState = "Served";
                    Table table = _context.Tables.FirstOrDefault(x => x.Id == order.TableId);
                    if (table != null)
                    {
                        table.CurrentState = "Served";
                    }

                    _context.SaveChanges();
                    return Ok("Order served successfully");
                }
            }

            return Ok("Order not found");
        }



        [Route("api/DeleteOrder")]
        [HttpDelete]
        public IHttpActionResult DeleteOrder(int orderId)
        {
            Order deleteOrder = _context.Orders.FirstOrDefault(a => a.Id == orderId);
            if (deleteOrder != null)
            {
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
            List<Order> orders = _context.Orders
                .Include(b => b.OrderSessions.Select(c => c.OrderedItems))
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(orders);
        }

    }
}
