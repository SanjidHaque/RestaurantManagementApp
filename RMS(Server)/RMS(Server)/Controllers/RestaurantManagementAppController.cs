using System;
using System.Collections.Generic;
using System.Data.Entity.Infrastructure;
using System.Data.Entity.Migrations;
using System.Data.Entity.Validation;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Claims;
using System.Web;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using RMS_Server_.Models;
using System.Web.Http.Cors;


namespace RMS_Server_.Controllers
{
    [EnableCors(origins: "*", headers: "*", methods: "*")]  
    public class RestaurantManagementAppController : ApiController
    {
        
   
        private ApplicationDbContext _context;

        private RestaurantManagementAppController()
        {
            _context = new ApplicationDbContext();
        }
       





        [HttpPost]
        [Route("api/ResetPassword")]
        [AllowAnonymous]
        public string ResetPassword(ForgotPassword forgotPassword)
        {
            var userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            var manager = new UserManager<ApplicationUser>(userStore);
            var provider = new DpapiDataProtectionProvider("Sample");

            manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(provider.Create("EmailConfirmation"));
            var user = manager.FindByName(forgotPassword.UserName);
       

           
            if (user != null)
            {
                string code = manager.GeneratePasswordResetToken(user.Id);
                var email = manager.GetEmail(user.Id);
                string fromaddr = "apphodoo@gmail.com";
                string toaddr = email;
                string password = "hodoo123";


                System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();
                msg.Subject = "Hodoo Reset Password";
                msg.From = new MailAddress(fromaddr);
                msg.Body = "\n\nReset Code:  " + user.Id + "\n\n\n";
                msg.To.Add(new MailAddress(toaddr));
                SmtpClient smtp = new SmtpClient();
                smtp.Host = "smtp.gmail.com";
                smtp.Port = 587;
                smtp.UseDefaultCredentials = false;
                smtp.EnableSsl = true;
                NetworkCredential nc = new NetworkCredential(fromaddr, password);
                smtp.Credentials = nc;
                smtp.Send(msg);



                var callbackUrl = string.Format("http://www.google.com?userId={0}&code={1}", user.Id, code);
                manager.SendEmail(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");

                return "User Name Found";
            }
            return "User Name Not Found";
        }

        [HttpPost]
        [Route("api/NewPassword")]
        [AllowAnonymous]
        public string NewPassword(ForgotPassword forgotPassword)
        {
            var userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            var manager = new UserManager<ApplicationUser>(userStore);
            var provider = new DpapiDataProtectionProvider("Sample");

            manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(provider.Create("EmailConfirmation"));
            var user = manager.FindById(forgotPassword.Id);
            if (user != null)
            {
                String hashedNewPassword = manager.PasswordHasher.HashPassword(forgotPassword.NewPassword);
                userStore.SetPasswordHashAsync(user, hashedNewPassword);
                userStore.UpdateAsync(user);
                //manager.ResetPasswordAsync(forgotPassword.Id, forgotPassword.Code, forgotPassword.NewPassword);
                return "Successful";
            }
            return "Not Successful";
        }



        [Route("api/GetUsersList")]
        [HttpGet]
        public List<ModifiedUser>  GetUsersList()
        {
           var modifiedUser = _context.ModifiedUsers.ToList();
           return modifiedUser;
        }


        [Route("api/DeleteUser")]
        [HttpPost]
        public void DeleteUser(AccountModel accountModel)
        {
            var userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            var manager = new UserManager<ApplicationUser>(userStore);
            var user = _context.Users.FirstOrDefault(p => p.UserName == accountModel.UserName);
            var modifiedUser = _context.ModifiedUsers.FirstOrDefault(q => q.UserName == accountModel.UserName);
            manager.RemoveFromRole(user.Id, accountModel.Role);
            _context.ModifiedUsers.Remove(modifiedUser);
            _context.Users.Remove(user);
            _context.SaveChanges();
        }
        
        [Route("api/User/Register")]
        [HttpPost]
        public IdentityResult Register(AccountModel model)
        {
            var userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            var manager = new UserManager<ApplicationUser>(userStore);
           
            var user = new ApplicationUser() { UserName = model.UserName, Email = model.Email };
            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 3
            };
            IdentityResult result = manager.Create(user, model.Password);
            if (result.Succeeded != false)
            {
                manager.AddToRoles(user.Id, model.Role);
                var modifiedUser = new ModifiedUser()
                {
                    UserName = model.UserName,
                    Email = model.Email,
                    Role = model.Role,
                    DateTime = model.DateTime
                };
                _context.ModifiedUsers.Add(modifiedUser);
                _context.SaveChanges();
            }
            return result;
        }

        

        [Route("api/GetFoodItems")]
        [HttpGet]
        public List<FoodItem> GetFoodItems()
        {
            var foodItems = _context.FoodItems.Include(c => c.Ingredients).ToList();
            return foodItems;
        }




        [Route("api/StoreOrder")]
        [HttpPost]
        public void StoreOrder(Order orders)
        {
            for (int i = 0; i < orders.OrderedItems.Count; i++)
            {
                var foodItemId = orders.OrderedItems[i].FoodItemId;
                var soldFoodItem = _context.FoodItems.FirstOrDefault(a => a.Id == foodItemId);
                soldFoodItem.TotalSale++;
                var foodItems = _context.FoodItems.Include(b => b.Ingredients).ToList();
                for (int j = 0; j < foodItems.Count; j++)
                {
                    if (foodItems[j].Id == foodItemId)
                    {
                        for (int k = 0; k < foodItems[j].Ingredients.Count; k++)
                        {
                            var quantity = foodItems[j].Ingredients[k].Quantity;
                            var totalQuantity = quantity*orders.OrderedItems[i].FoodItemQuantity;
                            var inventoryId = foodItems[j].Ingredients[k].InventoryId;
                            var inventory = _context.Inventories.ToList();
                            for (int l = 0; l < inventory.Count; l++)
                            {
                                if (inventory[l].Id == inventoryId)
                                {
                                    inventory[l].UsedQuantity += totalQuantity;
                                    inventory[l].RemainingQuantity -= totalQuantity;
                                }
                            }
                        }
                    }
                }
            }
            _context.OrderedItems.AddRange(orders.OrderedItems);
            _context.Orders.Add(orders);
            _context.SaveChanges();
        }


        [Route("api/DeleteOrder")]
        [HttpPost]
        public void DeleteOrder(Order orders)
        {
            var deleteOrder = _context.Orders.FirstOrDefault(a => a.Id == orders.Id);
            if (deleteOrder != null)
            {
                var deleteOrderedItems = _context.OrderedItems.Where(b => b.OrderId == deleteOrder.Id).ToList();
                if (deleteOrderedItems != null)
                {
                    _context.OrderedItems.RemoveRange(deleteOrderedItems);
                }
                _context.Orders.Remove(deleteOrder);
                _context.SaveChanges();
            }
        }
 
           
        [HttpGet]
        [Route("api/GetOrders")]
        public List<Order> Order()
        {
            return _context.Orders.Include(b => b.OrderedItems).ToList();
        }

        [HttpGet]
        [Route("api/GetInventories")]
        public List<Inventory> GetInventories()
        {
            return _context.Inventories.Include(b => b.InventoryHistoryModel).ToList();
        }

        [HttpGet]
        [Route("api/GetTables")]
        public List<Table> GetTables()
        {
            return _context.Tables.ToList();
        }

        [HttpPost]
        [Route("api/AddNewTable")]
        public void AddNewTable(Table table)
        {
            _context.Tables.Add(table);
            _context.SaveChanges();
        }


        [HttpPost]
        [Route("api/EditTable")]
        public void EditTable(Table table)
        {
            var getEdited = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (getEdited != null)
            {
                getEdited.Name = table.Name;
            }          
            _context.SaveChanges();
        }
        [HttpPost]
        [Route("api/DeleteTable")]
      
        public void DeleteTable(Table table)
        {
            var deleteTable = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (deleteTable!=null)
            {
                _context.Tables.Remove(deleteTable);
                _context.SaveChanges();
            }
          
        }


        [HttpPost]
        [Route("api/AddNewInventory")]
        public void AddInventoryItem(Inventory inventory)
        {
            _context.InventoryHistoryModels.AddRange(inventory.InventoryHistoryModel);
            _context.Inventories.Add(inventory);
            _context.SaveChanges();
        }



        [HttpPost]
        [Route("api/EditInventoryItem")]
        public void EditInventoryItem(Inventory inventory)
        {          
             var getEdited = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
             getEdited.Name = inventory.Name;
             getEdited.Unit = inventory.Unit;
            _context.SaveChanges();
         }


        [HttpPost]
        [Route("api/UpdateInventoryHistory")]
        public void UpdateInventoryHistory(InventoryHistoryModel inventoryHistoryModel)
        {
            var inventory = _context.Inventories.FirstOrDefault(p => p.Id == inventoryHistoryModel.InventoryId);
            inventory.RemainingQuantity += inventoryHistoryModel.UpdatedQuantity;
            _context.InventoryHistoryModels.Add(inventoryHistoryModel);
            _context.SaveChanges();
            var inventoryHistory =
                _context.InventoryHistoryModels.Where(q => q.InventoryId == inventoryHistoryModel.InventoryId).ToList();
            int totalPrice = 0;
            for (int i = 0; i < inventoryHistory.Count; i++)
            {
                totalPrice += (inventoryHistory[i].CurrentPrice * inventoryHistory[i].UpdatedQuantity);
            }
            int totalWeight = 0;
            for (int i = 0; i < inventoryHistory.Count; i++)
            {
                totalWeight += inventoryHistory[i].UpdatedQuantity;
            }
            int averagePrice = totalPrice/totalWeight;
            inventory.AveragePrice = averagePrice;
            _context.SaveChanges();
        }



        [HttpPost]
        [Route("api/DeleteInventoryItem")]
        public void DeleteInventoryItem(Inventory inventory)
        {
            var getIngredientsDeleted = _context.Ingredients.Where(p => p.InventoryId == inventory.Id).ToList();
            _context.Ingredients.RemoveRange(getIngredientsDeleted);
            var deleteInvHistory = _context.InventoryHistoryModels.Where(q => q.InventoryId == inventory.Id).ToList();
            _context.InventoryHistoryModels.RemoveRange(deleteInvHistory);
            var getDeleted = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
            _context.Inventories.Remove(getDeleted);
            _context.SaveChanges();
        }


        [HttpPost]
        [Route("api/AddFoodItem")]
        public void FoodItemAdd(FoodItem foodItem)
        {
            _context.Ingredients.AddRange(foodItem.Ingredients);
            _context.FoodItems.Add(foodItem);
            _context.SaveChanges();
        }

        [HttpPost]
        [Route("api/EditFoodItem")]
        public void FoodItemEdit(FoodItem foodItem)
        {
            var editedFoodItem = _context.FoodItems.Include(c => c.Ingredients).FirstOrDefault(p => p.Id == foodItem.Id);
            editedFoodItem.Name = foodItem.Name;
            editedFoodItem.Price = foodItem.Price;
            editedFoodItem.SerialNo = foodItem.SerialNo;
            editedFoodItem.MakingCost = foodItem.MakingCost;
            editedFoodItem.Profit = foodItem.Profit;
            _context.Ingredients.RemoveRange(editedFoodItem.Ingredients);
            _context.Ingredients.AddRange(foodItem.Ingredients);
            _context.SaveChanges();
        }




        [HttpPost]
        [Route("api/DeleteFoodItem")]
        public void FoodItemDelete(FoodItem foodItem)
        {
           var getOrderedItems = _context.OrderedItems.Where(p => p.FoodItemId == foodItem.Id).ToList();
            _context.OrderedItems.RemoveRange(getOrderedItems);
            var deleteIngredients = _context.Ingredients.Where(p => p.FooditemId == foodItem.Id).ToList();
           _context.Ingredients.RemoveRange(deleteIngredients);
           var deleteFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItem.Id);
           _context.FoodItems.Remove(deleteFoodItem);
           _context.SaveChanges();           
         }

        [HttpPost]
        [Route("api/SaveFoodItemImage")]
        public HttpResponseMessage SaveFoodItemImage()
        {
            string imageName = null;
            var httpRequest = HttpContext.Current.Request;         
            var postedFile = httpRequest.Files["Image"];         
            imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
            var filePath = HttpContext.Current.Server.MapPath("~/Content/" + imageName);
            postedFile.SaveAs(filePath);
            var uploadedImageId = httpRequest["FoodItemId"];           
            var foodItem = _context.FoodItems.FirstOrDefault(p => p.Id == uploadedImageId);
            foodItem.FoodItemImage = imageName;
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.Created);
        }

    }
}
