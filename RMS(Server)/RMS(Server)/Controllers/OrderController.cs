﻿using System.Collections.Generic;
using System.Linq;
using System.Web.Http;
using System.Data.Entity;
using RMS_Server_.Models;
using RMS_Server_.Services;


namespace RMS_Server_.Controllers
{
    public class OrderController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly StatusTextService _statusTextService;

        private OrderController()
        {
            _context = new ApplicationDbContext();
            _statusTextService = new StatusTextService();
        }      


        [Route("api/PlaceOrder")]
        [HttpPut]
        public IHttpActionResult PlaceOrder(Order order)
        {
            List<Inventory> inventories = _context.Inventories.ToList();

            foreach (OrderSession orderOrderSession in order.OrderSessions)
            {
                if (orderOrderSession.CurrentState == "Not Ordered")
                {
                    foreach (OrderedItem orderedItem in orderOrderSession.OrderedItems)
                    {
                        FoodItem foodItem = _context.FoodItems.Include(x => x.Ingredients).FirstOrDefault(x => x.Id == orderedItem.FoodItemId);
                        if (foodItem != null)
                        {
                            foreach (Ingredient foodItemIngredient in foodItem.Ingredients)
                            {
                                float inventoryQuantity = orderedItem.FoodItemQuantity * foodItemIngredient.Quantity;

                                Inventory inventory =
                                    inventories.FirstOrDefault(x => x.Id == foodItemIngredient.InventoryId);
                                if (inventoryQuantity > inventory?.RemainingQuantity)
                                {
                                    return Ok(new { StatusText = _statusTextService.InsufficientInventories });
                                }
                            }
                        }
                    }
                }
            }

            foreach (OrderSession orderOrderSession in order.OrderSessions)
            {
                if (orderOrderSession.CurrentState == "Not Ordered")
                {
                    foreach (OrderedItem orderedItem in orderOrderSession.OrderedItems)
                    {
                        FoodItem foodItem = _context.FoodItems.FirstOrDefault(x => x.Id == orderedItem.FoodItemId);
                        if (foodItem != null)
                        {
                            foreach (Ingredient foodItemIngredient in foodItem.Ingredients)
                            {
                                float inventoryQuantity = orderedItem.FoodItemQuantity * foodItemIngredient.Quantity;

                                Inventory inventory =
                                    inventories.FirstOrDefault(x => x.Id == foodItemIngredient.InventoryId);
                                if (inventory != null)
                                {
                                    inventory.RemainingQuantity -= inventoryQuantity;
                                    inventory.UsedQuantity += inventoryQuantity;
                                    _context.Entry(inventory).State = EntityState.Modified;
                                }
                            }

                            foodItem.TotalSale++;
                            _context.Entry(foodItem).State = EntityState.Modified;
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

                    _context.Entry(getExistingOrder).State = EntityState.Modified;
                    _context.SaveChanges();
                }
            }

            OrderSession orderSession = order.OrderSessions.FirstOrDefault(x => x.CurrentState == "Not Ordered");

            if (orderSession != null)
            {
                orderSession.CurrentState = "Ordered";
                _context.Entry(orderSession).State = EntityState.Modified;
                _context.SaveChanges();
            }

            return Ok(new { StatusText = _statusTextService.Success, order });
        }



        [Route("api/RevertInventory")]
        [HttpPut]
        public IHttpActionResult RevertInventory(OrderSession orderSession)
        {
            List<Inventory> inventories = _context.Inventories.ToList();

            foreach (OrderedItem orderedItem in orderSession.OrderedItems)
            {
                FoodItem foodItem = _context.FoodItems.Include(x => x.Ingredients).FirstOrDefault(x => x.Id == orderedItem.FoodItemId);
                if (foodItem != null)
                {
                    foreach (Ingredient foodItemIngredient in foodItem.Ingredients)
                    {
                        float inventoryQuantity = orderedItem.FoodItemQuantity * foodItemIngredient.Quantity;

                        Inventory inventory =
                            inventories.FirstOrDefault(x => x.Id == foodItemIngredient.InventoryId);
                        if (inventory != null)
                        {
                            inventory.RemainingQuantity += inventoryQuantity;
                            inventory.UsedQuantity -= inventoryQuantity;
                            _context.Entry(inventory).State = EntityState.Modified;
                        }
                    }

                    foodItem.TotalSale--;
                    _context.Entry(foodItem).State = EntityState.Modified;
                    _context.SaveChanges();
                }
            }

            return Ok(new { StatusText = _statusTextService.Success });
        }


        [Route("api/CancelOrder")]
        [HttpPut]
        public IHttpActionResult CancelOrder(OrderSession orderSession)
        {
            OrderSession getOrderSession = _context.OrderSessions
                .FirstOrDefault(x => x.Id == orderSession.Id);

            List<OrderedItem> orderedItems = _context.OrderedItems
                .Where(c => c.OrderSessionId == orderSession.Id)
                .ToList();


            if (getOrderSession != null)
            {
                getOrderSession.OrderedItems.ForEach(x =>
                {
                    x.CurrentState = "Cancelled";
                    x.CancellationReason = orderSession.OrderedItems[0].CancellationReason;
                });
                getOrderSession.CurrentState = "Cancelled";
                _context.SaveChanges();

                Order order = _context.Orders.Include(c => c.OrderSessions)
                    .FirstOrDefault(x => x.Id == orderSession.OrderId);

                List<OrderSession> orderSessions = _context.OrderSessions
                    .Where(c => c.OrderId == orderSession.OrderId)
                    .ToList();

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


                        _context.Entry(order).State = EntityState.Modified;
                        _context.SaveChanges();
                    });

                    order.GrossTotalPrice = order.TotalPrice;
                    order.Profit = order.TotalPrice - order.InventoryCost;
                    _context.Entry(order).State = EntityState.Modified;
                    _context.SaveChanges();


                    if (order.OrderSessions.Where(x => x.CurrentState == "Cancelled").ToList().Count
                        == order.OrderSessions.ToList().Count)
                    {
                        order.CurrentState = "Cancelled";
                    }
                    else
                    {
                        List<OrderSession> completeOrders = order.OrderSessions.Where(
                            x => x.CurrentState == "Ordered"
                        ).ToList();

                        order.CurrentState = completeOrders.Count > 0 ? "Ordered" : "Served";
                    }

                    _context.Entry(order).State = EntityState.Modified;
                    _context.SaveChanges();

                    return Ok(new { StatusText = _statusTextService.Success });

                }
            }
           
            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
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
                _context.Entry(getOrderSession).State = EntityState.Modified;
                _context.SaveChanges();

                Order order = _context.Orders.FirstOrDefault(x => x.Id == getOrderSession.OrderId);
                if (order != null)
                {

                    int count = 0;
                    for (int i = 0; i < order.OrderSessions.Count; i++)
                    {
                        if (order.OrderSessions[i].CurrentState == "Served")
                        {
                            count++;
                        }
                    }

                    if (count == order.OrderSessions.Count)
                    {
                        order.CurrentState = "Served";                      
                    }
                    else
                    {
                        order.CurrentState = "Ordered";
                    }

                    _context.Entry(order).State = EntityState.Modified;
                    _context.SaveChanges();
                    return Ok(new { StatusText = _statusTextService.Success });
                }
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }

        [Route("api/ValidateOrder")]
        [HttpPost]
        public IHttpActionResult ValidateOrder(Order order)
        {
            Order getOrder = _context.Orders.Include(x => x.OrderSessions).FirstOrDefault(x => x.Id == order.Id);
            
            if (getOrder == null)
            {
                return Ok(new { StatusText = _statusTextService.ResourceNotFound });
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

            _context.Entry(getOrder).State = EntityState.Modified;
            _context.SaveChanges();
            
            return Ok(new { StatusText = _statusTextService.Success });
        }



        [Route("api/DeleteOrder/{orderId}")]
        [HttpDelete]
        public IHttpActionResult DeleteOrder(int orderId)
        {
            Order deleteOrder = _context.Orders.FirstOrDefault(a => a.Id == orderId);

            if (deleteOrder != null)
            {
                if (deleteOrder.CurrentState == "Ordered" || deleteOrder.CurrentState == "Served")
                {
                    return Ok(new { StatusText = _statusTextService.ReportingPurposeIssue });
                }
                _context.Orders.Remove(deleteOrder);
                _context.SaveChanges();
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }

        [HttpGet]
        [Route("api/GetOrder/{orderId}")]
        public IHttpActionResult GetOrder(int orderId)
        {
            Order order = _context.Orders.FirstOrDefault(x => x.Id == orderId);

            List<OrderSession> orderSessions = _context.OrderSessions
                .Where(x => x.OrderId == orderId)
                .ToList();

            List<OrderedItem> orderedItems = _context.OrderedItems
                .Where(c => c.OrderSession.Order.Id == orderId)
                .ToList();

            return Ok(order);

        }

        [HttpGet]
        [Route("api/GetAllOrder")]
        public IHttpActionResult GetAllOrder()
        {

            List<Order> orders = _context.Orders.OrderByDescending(x => x.Id)
                .ToList();

            List<OrderSession> orderSessions = _context.OrderSessions.Include(x => x.Order)
                .ToList();

            List<OrderedItem> orderedItems = _context.OrderedItems.Include(c => c.OrderSession)
                .ToList();

            return Ok(orders);
        }

    }
}
