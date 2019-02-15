using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
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
    [EnableCors(origins: "http://localhost:4200", headers: "*", methods: "*")]  
    public class RestaurantManagementAppController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private RestaurantManagementAppController()
        {
            _context = new ApplicationDbContext();
        }
       

        [HttpPost]
        [Route("api/ResetPassword")]
        [AllowAnonymous]
        public string ResetPassword(ForgotPassword forgotPassword)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            DpapiDataProtectionProvider provider = new DpapiDataProtectionProvider("Sample");

            manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(provider.Create("EmailConfirmation"));
            ApplicationUser user = manager.FindByName(forgotPassword.UserName);
       
    
           
            if (user != null)
            {
                string code = manager.GeneratePasswordResetToken(user.Id);
                string email = manager.GetEmail(user.Id);
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

          

                string callbackUrl = string.Format("http://www.google.com?userId={0}&code={1}", user.Id, code);
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
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            DpapiDataProtectionProvider provider = new DpapiDataProtectionProvider("Sample");

            manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(provider.Create("EmailConfirmation"));
            ApplicationUser user = manager.FindById(forgotPassword.Id);
            if (user != null)
            {
                String hashedNewPassword = manager.PasswordHasher.HashPassword(forgotPassword.NewPassword);
                userStore.SetPasswordHashAsync(user, hashedNewPassword);
                userStore.UpdateAsync(user);
                return "Successful";
            }
            return "Not Successful";
        }



        [Route("api/GetUsersList")]
        [HttpGet]
        public List<ModifiedUser> GetUsersList()
        {
           List<ModifiedUser> modifiedUser = _context.ModifiedUsers.OrderBy(x => x.UserName).ToList();
           return modifiedUser;
        }


        [Route("api/DeleteUser")]
        [HttpPost]
        public void DeleteUser(AccountModel accountModel)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = _context.Users.FirstOrDefault(p => p.UserName == accountModel.UserName);
          
            if (user != null)
            {
                manager.RemoveFromRole(user.Id, accountModel.Role);
                
                _context.Users.Remove(user);
            }

            ModifiedUser modifiedUser = _context.ModifiedUsers
                .FirstOrDefault(q => q.UserName == accountModel.UserName);
            if (modifiedUser != null)
            {
                _context.ModifiedUsers.Remove(modifiedUser);
            }
            _context.SaveChanges();
        }
        
        [Route("api/User/Register")]
        [HttpPost]
        public IdentityResult Register(AccountModel model)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
           
            ApplicationUser user = new ApplicationUser() { UserName = model.UserName, Email = model.Email };
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
            List<FoodItem> foodItems = _context.FoodItems.Include(c => c.Ingredients).OrderBy(x => x.Name).ToList();
            return foodItems;
        }




        [Route("api/StoreOrder")]
        [HttpPost]
        public void StoreOrder(Order orders)
        {
            for (int i = 0; i < orders.OrderedItems.Count; i++)
            {
                string foodItemId = orders.OrderedItems[i].FoodItemId;
                FoodItem soldFoodItem = _context.FoodItems.FirstOrDefault(a => a.Id == foodItemId);
                if (soldFoodItem != null)
                {
                    soldFoodItem.TotalSale++;
                }
             
                List<FoodItem> foodItems = _context.FoodItems.Include(b => b.Ingredients).ToList();
                for (int j = 0; j < foodItems.Count; j++)
                {
                    if (foodItems[j].Id == foodItemId)
                    {
                        for (int k = 0; k < foodItems[j].Ingredients.Count; k++)
                        {
                            var quantity = foodItems[j].Ingredients[k].Quantity;
                            var totalQuantity = quantity*orders.OrderedItems[i].FoodItemQuantity;
                            string inventoryId = foodItems[j].Ingredients[k].InventoryId;
                            List<Inventory> inventory = _context.Inventories.ToList();
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
            Order deleteOrder = _context.Orders.FirstOrDefault(a => a.Id == orders.Id);
            if (deleteOrder != null)
            {
                List<OrderedItems> deleteOrderedItems = _context.OrderedItems
                    .Where(b => b.OrderId == deleteOrder.Id).ToList();
                _context.OrderedItems.RemoveRange(deleteOrderedItems);
                _context.Orders.Remove(deleteOrder);
                _context.SaveChanges();
            }
        }
 
           
        [HttpGet]
        [Route("api/GetOrders")]
        public List<Order> Order()
        {
            return _context.Orders.Include(b => b.OrderedItems).OrderBy(x => x.Profit).ToList();
        }

        [HttpGet]
        [Route("api/GetInventories")]
        public List<Inventory> GetInventories()
        {
            return _context.Inventories.Include(b => b.InventoryHistoryModel).OrderBy(x => x.Name).ToList();
        }

        [HttpGet]
        [Route("api/GetTables")]
        public List<Table> GetTables()
        {
            return _context.Tables.OrderBy(x => x.Name).ToList();
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
            Table getEdited = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
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
            Table deleteTable = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (deleteTable == null) return;
            _context.Tables.Remove(deleteTable);
            _context.SaveChanges();

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
            Inventory getEdited = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
            if (getEdited != null)
            {
                getEdited.Name = inventory.Name;
                getEdited.Unit = inventory.Unit;
            }

            _context.SaveChanges();
         }


        [HttpPost]
        [Route("api/UpdateInventoryHistory")]
        public void UpdateInventoryHistory(InventoryHistoryModel inventoryHistoryModel)
        {
            Inventory inventory = _context.Inventories.FirstOrDefault(p => p.Id == inventoryHistoryModel.InventoryId);
            if (inventory != null)
            {
                inventory.RemainingQuantity += inventoryHistoryModel.UpdatedQuantity;
                _context.InventoryHistoryModels.Add(inventoryHistoryModel);
                _context.SaveChanges();
                List<InventoryHistoryModel> inventoryHistory =
                    _context.InventoryHistoryModels
                        .Where(q => q.InventoryId == inventoryHistoryModel.InventoryId)
                        .ToList();
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

                int averagePrice = totalPrice / totalWeight;
                inventory.AveragePrice = averagePrice;
            }

            _context.SaveChanges();
        }



        [HttpPost]
        [Route("api/DeleteInventoryItem")]
        public void DeleteInventoryItem(Inventory inventory)
        {
            List<Ingredient> getIngredientsDeleted = _context.Ingredients
                .Where(p => p.InventoryId == inventory.Id)
                .ToList();
            _context.Ingredients.RemoveRange(getIngredientsDeleted);
            List<InventoryHistoryModel> deleteInvHistory = _context.InventoryHistoryModels
                .Where(q => q.InventoryId == inventory.Id)
                .ToList();
            _context.InventoryHistoryModels.RemoveRange(deleteInvHistory);
            Inventory getDeleted = _context.Inventories.FirstOrDefault(p => p.Id == inventory.Id);
            if (getDeleted != null) _context.Inventories.Remove(getDeleted);
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
            FoodItem editedFoodItem = _context.FoodItems.Include(c => c.Ingredients).FirstOrDefault(p => p.Id == foodItem.Id);
            if (editedFoodItem != null)
            {
                editedFoodItem.Name = foodItem.Name;
                editedFoodItem.Price = foodItem.Price;
                editedFoodItem.SerialNo = foodItem.SerialNo;
                editedFoodItem.MakingCost = foodItem.MakingCost;
                editedFoodItem.Profit = foodItem.Profit;
                _context.Ingredients.RemoveRange(editedFoodItem.Ingredients);
            }

            _context.Ingredients.AddRange(foodItem.Ingredients);
            _context.SaveChanges();
        }




        [HttpPost]
        [Route("api/DeleteFoodItem")]
        public void FoodItemDelete(FoodItem foodItem)
        {
            FoodItem deleteFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItem.Id);
            if (deleteFoodItem != null)
            {
                DeleteFoodItemImage(deleteFoodItem);
                List<OrderedItems> getOrderedItems = _context.OrderedItems
                    .Where(p => p.FoodItemId == foodItem.Id)
                    .ToList();

                _context.OrderedItems.RemoveRange(getOrderedItems);
                List<Ingredient> deleteIngredients = _context.Ingredients
                    .Where(p => p.FooditemId == foodItem.Id)
                    .ToList();
                _context.Ingredients.RemoveRange(deleteIngredients);
                _context.FoodItems.Remove(deleteFoodItem);
                _context.SaveChanges();
            }
         }

        [HttpPost]
        [Route("api/SaveFoodItemImage")]
        public HttpResponseMessage SaveFoodItemImage()
        {
            string imageName = null;
            HttpRequest httpRequest = HttpContext.Current.Request;         
            HttpPostedFile postedFile = httpRequest.Files["Image"];         
            imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
            string filePath = HttpContext.Current.Server.MapPath("~/Content/" + imageName);
            postedFile.SaveAs(filePath);
            string uploadedImageId = httpRequest["FoodItemId"];           
            FoodItem foodItem = _context.FoodItems.FirstOrDefault(p => p.Id == uploadedImageId);
            if (foodItem != null) foodItem.FoodItemImage = imageName;
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.Created);
        }


      
        public void DeleteFoodItemImage(FoodItem foodItem)
        {
            string filePath = HttpContext.Current.Server.MapPath("~/Content/" + foodItem.FoodItemImage);
            if ((System.IO.File.Exists(filePath)))
            {
                System.IO.File.Delete(filePath);
            }
          
        }
 

    }
}
