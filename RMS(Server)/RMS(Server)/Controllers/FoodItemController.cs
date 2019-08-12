using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using RMS_Server_.Models;

namespace RMS_Server_.Controllers
{
    public class FoodItemController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private FoodItemController()
        {
            _context = new ApplicationDbContext();
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
                return NotFound();
            }

            if (CheckDuplicateSerialNumber(foodItem, false))
            {
                return Ok("Error");
            }

            _context.FoodItems.Add(foodItem);
            _context.SaveChanges();
            return Ok(foodItem);
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
                return NotFound();
            }

            if (CheckDuplicateSerialNumber(foodItem, true))
            {
                return Ok("Error");
            }

            FoodItem editedFoodItem = _context.FoodItems
                .Include(c => c.Ingredients)
                .FirstOrDefault(p => p.Id == foodItem.Id);
            if (editedFoodItem != null)
            {
                editedFoodItem.Name = foodItem.Name;
                editedFoodItem.Price = foodItem.Price;
                editedFoodItem.SerialNumber = foodItem.SerialNumber;
                editedFoodItem.InventoryCost = foodItem.InventoryCost;
                editedFoodItem.Profit = foodItem.Profit;
                _context.Ingredients.RemoveRange(editedFoodItem.Ingredients);
                _context.Ingredients.AddRange(foodItem.Ingredients);

                _context.Entry(editedFoodItem).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }




        [HttpDelete]
        [Route("api/DeleteFoodItem/{foodItemId}")]
        public IHttpActionResult DeleteFoodItem(int foodItemId)
        {

            int orderedItemsCount = _context.OrderedItems
                .Where(x => x.FoodItemId == foodItemId)
                .AsNoTracking()
                .ToList()
                .Count;

            if (orderedItemsCount != 0)
            {
                return Ok("Failed");
            }

            FoodItem deleteFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItemId);

            if (deleteFoodItem != null)
            {
                DeleteFoodItemImage(deleteFoodItem);
                _context.FoodItems.Remove(deleteFoodItem);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
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
            return Ok();          
        }



        private void DeleteFoodItemImage(FoodItem foodItem)
        {
            string filePath = HttpContext.Current.Server.MapPath("~/Content/FoodItemImages/" + foodItem.FoodItemImageName);
            if ((System.IO.File.Exists(filePath)))
            {
                System.IO.File.Delete(filePath);
            }
        }

    }
}
