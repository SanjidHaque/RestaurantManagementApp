using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using RMS_Server_.Models;
using RMS_Server_.Services;

namespace RMS_Server_.Controllers
{
    public class InventoryController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly StatusTextService _statusTextService;


        private InventoryController()
        {
            _context = new ApplicationDbContext();
            _statusTextService = new StatusTextService();
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
                return Ok(new { StatusText = _statusTextService.SomethingWentWorng});
            }

            if (_context.Inventories.Any(o => o.Name == inventory.Name))
            {
                return Ok(new { StatusText = _statusTextService.DuplicateItemName });
            }

            _context.Inventories.Add(inventory);
            _context.SaveChanges();
             return Ok(new { StatusText = _statusTextService.Success });
        }



        [HttpPut]
        [Route("api/EditInventory")]
        public IHttpActionResult EditInventory(Inventory inventory)
        {
            Inventory editInventoryItem = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);

            if (editInventoryItem != null)
            {
                if (_context.Inventories.Any(o => o.Name == inventory.Name && o.Name != editInventoryItem.Name))
                {
                    return Ok(new { StatusText = _statusTextService.DuplicateItemName });
                }

                editInventoryItem.Name = inventory.Name;
                editInventoryItem.Unit = inventory.Unit;

                _context.Entry(editInventoryItem).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }

        
        [HttpPost]
        [Route("api/AddInventoryQuantity")]
        public IHttpActionResult AddInventoryQuantity(InventoryHistory inventoryHistory)
        {
            Inventory inventory = _context.Inventories
                .FirstOrDefault(p => p.Id == inventoryHistory.InventoryId);

            if (inventory != null)
            {
                _context.InventoryHistories.Add(inventoryHistory);
                _context.SaveChanges();

                List<InventoryHistory> inventoryHistories = _context.InventoryHistories
                        .Where(q => q.InventoryId == inventoryHistory.InventoryId)
                        .ToList();

                inventory.AveragePrice = CalculateAveragePrice(inventory, inventoryHistories);
                inventory.RemainingQuantity += inventoryHistory.Quantity;

                _context.Entry(inventory).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }


        [HttpPut]
        [Route("api/RemoveInventoryQuantity")]
        public IHttpActionResult RemoveInventoryQuantity(InventoryHistory inventoryHistory)
        {
            Inventory inventory = _context.Inventories
                .FirstOrDefault(p => p.Id == inventoryHistory.InventoryId);

            if (inventory != null)
            {
                if (inventory.RemainingQuantity < inventoryHistory.Quantity)
                {
                    return Ok(new { StatusText = _statusTextService.QuantityIsTooLarge });
                }

                _context.InventoryHistories.Add(inventoryHistory);
                _context.SaveChanges();

                List<InventoryHistory> inventoryHistories = _context.InventoryHistories
                    .Where(q => q.InventoryId == inventoryHistory.InventoryId)
                    .ToList();

                inventory.RemainingQuantity -= inventoryHistory.Quantity;
                inventory.UsedQuantity += inventoryHistory.Quantity;
                inventory.AveragePrice = CalculateAveragePrice(inventory, inventoryHistories); 

                _context.Entry(inventory).State = EntityState.Modified;
                _context.SaveChanges();

                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }


        [HttpDelete]
        [Route("api/DeleteInventory/{inventoryId}")]
        public IHttpActionResult DeleteInventory(int inventoryId)
        {          
            Ingredient ingredient = _context.Ingredients.FirstOrDefault(x => x.InventoryId == inventoryId);
            if (ingredient != null)
            {
                return Ok(new { StatusText = _statusTextService.ReportingPurposeIssue });
            }

            Inventory getDeleted = _context.Inventories.FirstOrDefault(p => p.Id == inventoryId);
            if (getDeleted != null)
            {
                _context.Inventories.Remove(getDeleted);
            }

            _context.SaveChanges();
            return Ok(new { StatusText = _statusTextService.Success });
        }

        private float CalculateAveragePrice(Inventory inventory, List<InventoryHistory> inventoryHistories)
        {
            float totalPrice = 0;
            float totalWeight = 0;
            inventoryHistories.ForEach(x =>
            {
                totalPrice += (x.Price * x.Quantity);
                totalWeight += x.Quantity;
            });

            float averagePrice = totalPrice / totalWeight;
            return averagePrice;
        }
    }
}
