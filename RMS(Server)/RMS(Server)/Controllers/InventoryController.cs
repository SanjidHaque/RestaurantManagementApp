using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using RMS_Server_.Models;

namespace RMS_Server_.Controllers
{
    public class InventoryController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private InventoryController()
        {
            _context = new ApplicationDbContext();
        }

        [HttpGet]
        [Route("api/GetAllInventoryItem")]
        public IHttpActionResult GetAllInventoryItem()
        {
            List<Inventory> inventories = _context.Inventories
                .Include(b => b.InventoryHistory)
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(inventories);
        }


        [HttpPost]
        [Route("api/AddNewInventoryItem")]
        public IHttpActionResult AddNewInventoryItem(Inventory inventory)
        {
            if (inventory == null)
            {
                return NotFound();
            }
            _context.Inventories.Add(inventory);
            inventory.InventoryHistory.ForEach(x => { x.InventoryId = inventory.Id; });
            _context.InventoryHistories.AddRange(inventory.InventoryHistory);
            _context.SaveChanges();
            return Ok();
        }



        [HttpPut]
        [Route("api/EditInventoryItem")]
        public IHttpActionResult EditInventoryItem(Inventory inventory)
        {
            Inventory editInventoryItem = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
            if (editInventoryItem != null)
            {
                editInventoryItem.Name = inventory.Name;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }

        [HttpPut]
        [Route("api/RemoveInventoryQuantity")]
        public IHttpActionResult RemoveInventoryQuantity(Inventory inventory)
        {
            Inventory getInventory = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
            if (getInventory != null)
            {
                if (getInventory.RemainingQuantity < inventory.RemainingQuantity)
                {
                    return Ok("Error");
                }
                getInventory.RemainingQuantity -= inventory.RemainingQuantity;
                _context.SaveChanges();
                return Ok("Success");
            }

            return NotFound();
        }


        [HttpPost]
        [Route("api/UpdateInventoryHistory")]
        public IHttpActionResult UpdateInventoryHistory(InventoryHistory inventoryHistory)
        {
            if (inventoryHistory == null)
            {
                return NotFound();
            }
            Inventory inventory = _context.Inventories.FirstOrDefault(p => p.Id == inventoryHistory.InventoryId);
            if (inventory != null)
            {
                _context.InventoryHistories.Add(inventoryHistory);
                inventory.RemainingQuantity += inventoryHistory.BuyingQuantity;
                _context.SaveChanges();
                List<InventoryHistory> getInventoryHistories = _context.InventoryHistories
                        .Where(q => q.InventoryId == inventoryHistory.InventoryId)
                        .ToList();
                CalculateAveragePrice(inventory, getInventoryHistories);
                return Ok();
            }

            return NotFound();
        }

        [HttpDelete]
        [Route("api/DeleteInventoryItem/{inventoryId}")]
        public IHttpActionResult DeleteInventoryItem(int inventoryId)
        {
            Ingredient ingredient = _context.Ingredients.FirstOrDefault(x => x.InventoryId == inventoryId);
            if (ingredient != null)
            {
                return Ok("Failed");
            }

            Inventory getDeleted = _context.Inventories.FirstOrDefault(p => p.Id == inventoryId);
            if (getDeleted != null)
            {
                _context.Inventories.Remove(getDeleted);
            }
            _context.SaveChanges();
            return Ok();
        }

        private void CalculateAveragePrice(Inventory inventory, List<InventoryHistory> getInventoryHistories)
        {
            int totalPrice = 0;
            int totalWeight = 0;
            getInventoryHistories.ForEach(x =>
            {
                totalPrice += (x.BuyingPrice * x.BuyingQuantity);
                totalWeight += x.BuyingQuantity;
            });

            int averagePrice = totalPrice / totalWeight;
            inventory.AveragePrice = averagePrice;
            _context.SaveChanges();
        }
    }
}
