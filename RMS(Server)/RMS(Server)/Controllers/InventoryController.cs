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
        [Route("api/GetInventory/{inventoryId}")]
        public IHttpActionResult GetInventory(int inventoryId)
        {
            Inventory inventory = _context.Inventories.FirstOrDefault(x => x.Id == inventoryId);

            List<InventoryHistory> inventoryHistories = _context.InventoryHistories
                .Where(x => x.InventoryId == inventoryId)
                .ToList();

            return Ok(inventory);
        }

        [HttpGet]
        [Route("api/GetAllInventory")]
        public IHttpActionResult GetAllInventory()
        {
            List<Inventory> inventories = _context.Inventories
                .OrderByDescending(x => x.Id)
                .ToList();

            List<InventoryHistory> inventoryHistories = _context.InventoryHistories.
                Include(x => x.Inventory).
                ToList();

            return Ok(inventories);
        }


        [HttpPost]
        [Route("api/AddNewInventory")]
        public IHttpActionResult AddNewInventory(Inventory inventory)
        {
            if (inventory == null)
            {
                return NotFound();
            }
            _context.Inventories.Add(inventory);
            _context.SaveChanges();
            return Ok();
        }



        [HttpPut]
        [Route("api/EditInventory")]
        public IHttpActionResult EditInventory(Inventory inventory)
        {
            Inventory editInventoryItem = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
            if (editInventoryItem != null)
            {
                editInventoryItem.Name = inventory.Name;
                editInventoryItem.Unit = inventory.Unit;

                _context.Entry(editInventoryItem).State = EntityState.Modified;
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

                _context.Entry(getInventory).State = EntityState.Modified;
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
                _context.Entry(inventory).State = EntityState.Modified;


                List<InventoryHistory> getInventoryHistories = _context.InventoryHistories
                        .Where(q => q.InventoryId == inventoryHistory.InventoryId)
                        .ToList();

                CalculateAveragePrice(inventory, getInventoryHistories);
                return Ok();
            }

            return NotFound();
        }

        [HttpDelete]
        [Route("api/DeleteInventory/{inventoryId}")]
        public IHttpActionResult DeleteInventory(int inventoryId)
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
            float totalPrice = 0;
            float totalWeight = 0;
            getInventoryHistories.ForEach(x =>
            {
                totalPrice += (x.BuyingPrice * x.BuyingQuantity);
                totalWeight += x.BuyingQuantity;
            });

            float averagePrice = totalPrice / totalWeight;
            inventory.AveragePrice = averagePrice;
            _context.Entry(inventory).State = EntityState.Modified;
            _context.SaveChanges();
        }
    }
}
