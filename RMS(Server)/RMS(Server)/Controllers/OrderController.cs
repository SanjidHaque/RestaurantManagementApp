using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Web.Http;
using System.Data.Entity;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security.DataProtection;
using RMS_Server_.Models;


namespace RMS_Server_.Controllers
{ 
    public class OrderController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private OrderController()
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
        
        [Route("api/AddNewUser")]
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

        

       




        [Route("api/AddNewOrder")]
        [HttpPost]
        public IHttpActionResult AddNewOrder(Order order)
        {
            for (int i = 0; i < order.OrderedItem.Count; i++)
            {
                int foodItemId = order.OrderedItem[i].FoodItemId;
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
                            var totalQuantity = quantity*order.OrderedItem[i].FoodItemQuantity;
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
            _context.OrderedItems.AddRange(order.OrderedItem);
            _context.Orders.Add(order);
            _context.SaveChanges();
            return Ok();
        }


        [Route("api/DeleteOrder")]
        [HttpDelete]
        public IHttpActionResult DeleteOrder(int orderId)
        {
            Order deleteOrder = _context.Orders.FirstOrDefault(a => a.Id == orderId);
            if (deleteOrder != null)
            {
                _context.Orders.Remove(deleteOrder);
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }
 
           
        [HttpGet]
        [Route("api/GetAllOrder")]
        public IHttpActionResult GetAllOrder()
        {
            List<Order> orders = _context.Orders
                .Include(b => b.OrderedItem)
                .OrderByDescending(x => x.Id)
                .ToList();
            return Ok(orders);
        }

        

      




       


        
 

    }
}
