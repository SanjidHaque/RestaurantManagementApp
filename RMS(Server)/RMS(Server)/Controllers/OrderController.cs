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

            OrderSession orderSession = order.OrderSessions.FirstOrDefault(x => x.CurrentState == "Not Ordered");

            if (orderSession != null)
            {
                orderSession.CurrentState = "Ordered";
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
