using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using RMS_Server_.Models;
using RMS_Server_.Services;

namespace RMS_Server_.Controllers
{
    public class FoodItemController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly StatusTextService _statusTextService;

        private FoodItemController()
        {
            _context = new ApplicationDbContext();
            _statusTextService = new StatusTextService();
        }


        [Route("api/GetFoodItem/{foodItemId}")]
        [HttpGet]
        public IHttpActionResult GetAllFoodItem(int foodItemId)
        {
            
            FoodItem foodItem = _context.FoodItems.FirstOrDefault(x => x.Id == foodItemId);

            List<Ingredient> ingredients = _context.Ingredients
                .Where(x => x.FoodItemId == foodItemId)
                .ToList();

            return Ok(foodItem);
        }

        [Route("api/GetAllFoodItem")]
        [HttpGet]
        public IHttpActionResult GetAllFoodItem()
        {

            List<FoodItem> foodItems = _context.FoodItems
                .OrderByDescending(x => x.Id)
                .ToList();

            List<Ingredient> ingredients = _context.Ingredients.Include(x => x.FoodItem)
                .ToList();


            return Ok(foodItems);
        }

        [HttpPost]
        [Route("api/AddNewFoodItem")]
        public IHttpActionResult AddNewFoodItem(FoodItem foodItem)
        {
            if (foodItem == null)
            {
                return Ok(new { StatusText = _statusTextService.SomethingWentWorng });
            }

            if (CheckDuplicateSerialNumber(foodItem, false))
            {
                return Ok(new { StatusText = _statusTextService.DuplicateSerialNumber });
            }

            if (_context.FoodItems.Any(o => o.Name == foodItem.Name))
            {
                return Ok(new { StatusText = _statusTextService.DuplicateItemName });
            }

            _context.FoodItems.Add(foodItem);
            _context.SaveChanges();

            return Ok(new { StatusText = _statusTextService.Success, foodItem });
        }

      
        private bool CheckDuplicateSerialNumber(FoodItem foodItem, bool editMode)
        {
            bool isDuplicate = false;
            List<FoodItem> foodItems = _context.FoodItems.AsNoTracking().ToList();
            foodItems.ForEach(x =>
            {
                if (editMode)
                {
                    if (x.SerialNumber == foodItem.SerialNumber && x.Id != foodItem.Id)
                    {
                        isDuplicate = true;
                    }
                }
                else
                {
                    if (x.SerialNumber == foodItem.SerialNumber)
                    {
                        isDuplicate = true;
                    }
                }
            });

            return isDuplicate;
        }



        [HttpPut]
        [Route("api/EditFoodItem")]
        public IHttpActionResult EditFoodItem(FoodItem foodItem)
        {
            if (foodItem == null)
            {
                return Ok(new { StatusText = _statusTextService.ResourceNotFound });
            }

            if (CheckDuplicateSerialNumber(foodItem, true))
            {
                return Ok(new { StatusText = _statusTextService.DuplicateSerialNumber });
            }

            FoodItem editedFoodItem = _context.FoodItems
                .Include(c => c.Ingredients)
                .FirstOrDefault(p => p.Id == foodItem.Id);

            if (editedFoodItem != null)
            {
                if (_context.FoodItems.Any(o => o.Name == foodItem.Name && o.Name != foodItem.Name))
                {
                    return Ok(new { StatusText = _statusTextService.DuplicateItemName });
                }


                editedFoodItem.Name = foodItem.Name;
                editedFoodItem.Price = foodItem.Price;
                editedFoodItem.SerialNumber = foodItem.SerialNumber;
                editedFoodItem.InventoryCost = foodItem.InventoryCost;
                editedFoodItem.Profit = foodItem.Profit;
                _context.Ingredients.RemoveRange(editedFoodItem.Ingredients);
                _context.Ingredients.AddRange(foodItem.Ingredients);

                _context.Entry(editedFoodItem).State = EntityState.Modified;
                _context.SaveChanges();
                
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }




        [HttpDelete]
        [Route("api/DeleteFoodItem/{foodItemId}")]
        public IHttpActionResult DeleteFoodItem(int foodItemId)
        {
            if (_context.OrderedItems.Any(o => o.FoodItemId == foodItemId))
            {
                return Ok(new { StatusText = _statusTextService.ReportingPurposeIssue });
            }

            FoodItem deleteFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItemId);

            if (deleteFoodItem != null)
            {
                DeleteFoodItemImage(deleteFoodItem);
                _context.FoodItems.Remove(deleteFoodItem);
                _context.SaveChanges();
                
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }



        [HttpPost]
        [Route("api/UploadFoodItemImage")]
        public IHttpActionResult SaveFoodItemImage()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;         
            HttpPostedFile postedFile = httpRequest.Files["FoodItemImage"];         
            string imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
            string filePath = HttpContext.Current.Server.MapPath("~/Content/FoodItemImages/" + imageName);
            postedFile.SaveAs(filePath);
            string foodItemIdInString = httpRequest["FoodItemId"];
            int foodItemId = Int32.Parse(foodItemIdInString);
            FoodItem foodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItemId);
            if (foodItem.FoodItemImageName == null)
            {
                foodItem.FoodItemImageName = imageName;
            }
            else
            {
                DeleteFoodItemImage(foodItem);
                foodItem.FoodItemImageName = imageName;
            }
            _context.SaveChanges();
            return Ok(new { StatusText = _statusTextService.Success });
        }



        private void DeleteFoodItemImage(FoodItem foodItem)
        {
            string filePath = HttpContext.Current.Server.MapPath("~/Content/FoodItemImages/" + foodItem.FoodItemImageName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }

    }
}
