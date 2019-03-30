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
        public IHttpActionResult GetUsersList()
        {
           List<ModifiedUser> modifiedUser = _context.ModifiedUsers.OrderBy(x => x.UserName).ToList();
           return Ok(modifiedUser);
        }


        [Route("api/DeleteUser")]
        [HttpPost]
        public IHttpActionResult DeleteUser(AccountModel accountModel)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser user = _context.Users.FirstOrDefault(p => p.UserName == accountModel.UserName);
            ModifiedUser modifiedUser = _context.ModifiedUsers
                .FirstOrDefault(q => q.UserName == accountModel.UserName);

            if (user != null && modifiedUser != null)
            {
                manager.RemoveFromRole(user.Id, accountModel.Role);
                _context.Users.Remove(user);              
                _context.ModifiedUsers.Remove(modifiedUser);
                _context.SaveChanges();
                return Ok();
            }
            return NotFound();
        }
        
        [Route("api/Register")]
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
            if (result.Succeeded)
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
        public IHttpActionResult GetFoodItems()
        {
            List<FoodItem> foodItems = _context.FoodItems.Include(c => c.Ingredients).OrderBy(x => x.Name).ToList();
            return Ok(foodItems);
        }




        [Route("api/StoreOrder")]
        [HttpPost]
        public IHttpActionResult StoreOrder(Order orders)
        {
            for (int i = 0; i < orders.OrderedItem.Count; i++)
            {
                int foodItemId = orders.OrderedItem[i].FoodItemId;
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
                            var totalQuantity = quantity*orders.OrderedItem[i].FoodItemQuantity;
                            int inventoryId = foodItems[j].Ingredients[k].InventoryId;
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
            _context.OrderedItems.AddRange(orders.OrderedItem);
            _context.Orders.Add(orders);
            _context.SaveChanges();
            return Ok();
        }


        [Route("api/DeleteOrder")]
        [HttpPost]
        public IHttpActionResult DeleteOrder(Order orders)
        {
            Order deleteOrder = _context.Orders.FirstOrDefault(a => a.Id == orders.Id);
            if (deleteOrder != null)
            {
                List<OrderedItem> deleteOrderedItems = _context.OrderedItems
                    .Where(b => b.OrderId == deleteOrder.Id).ToList();
                _context.OrderedItems.RemoveRange(deleteOrderedItems);
                _context.Orders.Remove(deleteOrder);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }
 
           
        [HttpGet]
        [Route("api/GetOrders")]
        public IHttpActionResult GetOrders()
        {
            List<Order> orders = _context.Orders.Include(b => b.OrderedItem).OrderBy(x => x.Profit).ToList();
            return Ok(orders);
        }

        

        [HttpGet]
        [Route("api/GetTables")]
        public IHttpActionResult GetTables()
        {
            List<Table> tables = _context.Tables.OrderBy(x => x.Name).ToList();
            return Ok(tables);
        }

        [HttpPost]
        [Route("api/AddNewTable")]
        public IHttpActionResult AddNewTable(Table table)
        {
            if (table != null)
            {
                _context.Tables.Add(table);
                _context.SaveChanges();
                return Ok(table.Id);
            }

            return NotFound();
        }


        [HttpPost]
        [Route("api/EditTable")]
        public IHttpActionResult EditTable(Table table)
        {
            Table getEdited = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (getEdited != null)
            {
                getEdited.Name = table.Name;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }


        [HttpPost]
        [Route("api/DeleteTable")]
        public IHttpActionResult DeleteTable(Table table)
        {
            Table deleteTable = _context.Tables.FirstOrDefault(p => p.Id == table.Id);
            if (deleteTable == null)
            {
                return NotFound();
            }
            _context.Tables.Remove(deleteTable);
            _context.SaveChanges();
            return Ok();

        }


       


        [HttpPost]
        [Route("api/AddFoodItem")]
        public IHttpActionResult AddFoodItem(FoodItem foodItem)
        {
            if (foodItem == null)
            {
                return NotFound();
            }
            _context.Ingredients.AddRange(foodItem.Ingredients);
            _context.FoodItems.Add(foodItem);
            _context.SaveChanges();
            return Ok();
        }

        [HttpPost]
        [Route("api/EditFoodItem")]
        public IHttpActionResult EditFoodItem(FoodItem foodItem)
        {
            if (foodItem == null)
            {
                return NotFound();
            }
            FoodItem editedFoodItem = _context.FoodItems.Include(c => c.Ingredients).FirstOrDefault(p => p.Id == foodItem.Id);
            if (editedFoodItem != null)
            {
                editedFoodItem.Name = foodItem.Name;
                editedFoodItem.Price = foodItem.Price;
             //   editedFoodItem.SerialNo = foodItem.SerialNo;
                editedFoodItem.InventoryCost = foodItem.InventoryCost;
                editedFoodItem.Profit = foodItem.Profit;
                _context.Ingredients.RemoveRange(editedFoodItem.Ingredients);
                _context.Ingredients.AddRange(foodItem.Ingredients);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }




        [HttpPost]
        [Route("api/DeleteFoodItem")]
        public IHttpActionResult DeleteFoodItem(FoodItem foodItem)
        {
            if (foodItem == null)
            {
                return NotFound();
            }
            FoodItem deleteFoodItem = _context.FoodItems.FirstOrDefault(p => p.Id == foodItem.Id);
            if (deleteFoodItem != null)
            {
                DeleteFoodItemImage(deleteFoodItem);
                List<OrderedItem> getOrderedItems = _context.OrderedItems
                    .Where(p => p.FoodItemId == foodItem.Id)
                    .ToList();

                _context.OrderedItems.RemoveRange(getOrderedItems);
                List<Ingredient> deleteIngredients = _context.Ingredients
                    .Where(p => p.FooditemId == foodItem.Id)
                    .ToList();
                _context.Ingredients.RemoveRange(deleteIngredients);
                _context.FoodItems.Remove(deleteFoodItem);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }

        [HttpPost]
        [Route("api/SaveFoodItemImage")]
        public IHttpActionResult SaveFoodItemImage()
        {
            HttpRequest httpRequest = HttpContext.Current.Request;
            /*string imageName = null;
            HttpRequest httpRequest = HttpContext.Current.Request;         
            HttpPostedFile postedFile = httpRequest.Files["Image"];         
            imageName = new String(Path.GetFileNameWithoutExtension(postedFile.FileName).Take(10).ToArray()).Replace(" ", "-");
            imageName = imageName + DateTime.Now.ToString("yymmssfff") + Path.GetExtension(postedFile.FileName);
            string filePath = HttpContext.Current.Server.MapPath("~/Content/" + imageName);
            postedFile.SaveAs(filePath);
            string uploadedImageId = httpRequest["FoodItemId"];           
            FoodItem foodItem = _context.FoodItems.FirstOrDefault(p => p.Id == uploadedImageId);
            if (foodItem != null) foodItem.FoodItemImageName = imageName;
            _context.SaveChanges();
            return Request.CreateResponse(HttpStatusCode.Created);*/
            return Ok(httpRequest);
        }


      
        public void DeleteFoodItemImage(FoodItem foodItem)
        {
            string filePath = HttpContext.Current.Server.MapPath("~/Content/" + foodItem.FoodItemImageName);
            if ((System.IO.File.Exists(filePath)))
            {
                System.IO.File.Delete(filePath);
            }
        }
 

    }
}
