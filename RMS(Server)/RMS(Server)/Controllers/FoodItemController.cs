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

        [Route("api/GetAllFoodItem")]
        [HttpGet]
        public IHttpActionResult GetAllFoodItem()
        {
            List<FoodItem> foodItems = _context.FoodItems
                .Include(c => c.Ingredients)
                .OrderByDescending(x => x.Id)
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
            _context.FoodItems.Add(foodItem);
            foodItem.Ingredients.ForEach(x => { x.FooditemId = foodItem.Id; });
            _context.Ingredients.AddRange(foodItem.Ingredients);
            _context.SaveChanges();
            return Ok(foodItem.Id);
        }



        [HttpPut]
        [Route("api/EditFoodItem")]
        public IHttpActionResult EditFoodItem(FoodItem foodItem)
        {
            if (foodItem == null)
            {
                return NotFound();
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
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }




        [HttpDelete]
        [Route("api/DeleteFoodItem/{foodItemId}")]
        public IHttpActionResult DeleteFoodItem(int foodItemId)
        {

            var orderedItemsCount = _context.OrderedItems.Where(x => x.Id == foodItemId).ToList().Count;
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
