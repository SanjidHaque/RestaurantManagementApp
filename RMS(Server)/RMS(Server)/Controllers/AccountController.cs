using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Mail;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using Microsoft.AspNet.Identity;
using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNet.Identity.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Cookies;
using Microsoft.Owin.Security.DataProtection;
using Microsoft.Owin.Security.OAuth;
using RMS_Server_.Models;
using RMS_Server_.Results;

namespace RMS_Server_.Controllers
{

    public class AccountController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private const string LocalLoginProvider = "Local";
        private ApplicationUserManager _userManager;

        public AccountController()
        {
            _context = new ApplicationDbContext();
        }

        public AccountController(ApplicationUserManager userManager,
            ISecureDataFormat<AuthenticationTicket> accessTokenFormat)
        {
            UserManager = userManager;
            AccessTokenFormat = accessTokenFormat;
        }

        public ApplicationUserManager UserManager
        {
            get
            {
                return _userManager ?? Request.GetOwinContext().GetUserManager<ApplicationUserManager>();
            }
            private set
            {
                _userManager = value;
            }
        }

        public ISecureDataFormat<AuthenticationTicket> AccessTokenFormat { get; private set; }


        [AllowAnonymous]
        [HttpPost]
        [Route("api/AddNewUserAccount")]
        public IHttpActionResult AddNewUserAccount(UserAccount userAccount)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);

            ApplicationUser user = new ApplicationUser
            {
                UserName = userAccount.UserName,
                Email = userAccount.Email,
                PhoneNumber = userAccount.PhoneNumber,
                FullName = userAccount.FullName,
                AddingDateTime = DateTime.Now.ToString("dddd, dd MMMM yyyy, hh:mm tt")
            };

            manager.PasswordValidator = new PasswordValidator
            {
                RequiredLength = 6
            };
            manager.UserValidator = new UserValidator<ApplicationUser>(manager)
            {
                RequireUniqueEmail = true
            };
            IdentityResult result = manager.Create(user, userAccount.Password);
            if (result.Succeeded)
            {
                manager.AddToRole(user.Id, userAccount.RoleName);
                return Ok(result);
            }
            return Ok(result);
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("api/GetAllRole")]
        public IHttpActionResult GetAllRole()
        {
            RoleStore<IdentityRole> roleStore = new RoleStore<IdentityRole>(_context);
            RoleManager<IdentityRole> roleManager = new RoleManager<IdentityRole>(roleStore);

            var roles = roleManager.Roles.Select(x => new {x.Id, x.Name }).ToList();
            return Ok(roles);
        }


        [HttpGet]
        [AllowAnonymous]
        [Route("api/GetAllUserAccount")]
        public IHttpActionResult GetAllUserAccount()
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            List<UserAccount> userAccounts = new List<UserAccount>();
            List<ApplicationUser> applicationUsers = _context.Users.ToList(); 
            
            foreach (var applicationUser in applicationUsers)
            {
                foreach (var role in applicationUser.Roles)
                {
                    string roleName;
                    if (role.RoleId == "1")
                    {
                        roleName = "Admin";
                    }
                    else
                    {
                        roleName = "Worker";
                    }
                    UserAccount userAccount = new UserAccount()
                    {
                        Id = applicationUser.Id,
                        UserName = applicationUser.UserName,
                        FullName = applicationUser.FullName,
                        Email = applicationUser.Email,
                        PhoneNumber = applicationUser.PhoneNumber,
                        Password = "",
                        AddingDateTime = applicationUser.AddingDateTime,
                        RoleName = roleName
                    };
                    userAccounts.Add(userAccount);
                }
            }

            return Ok(userAccounts);
        }


        [Route("api/DeleteUserAccount/{userAccountId}")]
        [HttpDelete]
        [AllowAnonymous]
        public IHttpActionResult DeleteUserAccount(string userAccountId)
        {
            ApplicationUser user = _context.Users.FirstOrDefault(p => p.Id == userAccountId);

            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
                return Ok();
            }
            return NotFound();
        }


        [Route("api/ChangePasswordByAdmin")]
        [HttpPut]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ChangePasswordyAdmin(ChangePassword changePassword)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser applicationUser = await manager.FindByIdAsync(changePassword.UserAccountId);

            if (applicationUser == null)
            {
                return NotFound();
            }

            string hashedNewPassword = manager.PasswordHasher.HashPassword(changePassword.NewPassword);
            await userStore.SetPasswordHashAsync(applicationUser, hashedNewPassword);
            await userStore.UpdateAsync(applicationUser);
            return Ok();
        }


        [Route("api/ChangePasswordyWorker")]
        [HttpPut]
        [AllowAnonymous]
        public async Task<IHttpActionResult> ChangePasswordyWorker(ChangePassword changePassword)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            ApplicationUser applicationUser = await manager.FindByIdAsync(changePassword.UserAccountId);

            if (applicationUser == null)
            {
                return NotFound();
            }

            IdentityResult result = await manager.ChangePasswordAsync(changePassword.UserAccountId, changePassword.OldPassword,changePassword.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        [Route("api/EditUserAccount")]
        [HttpPut]
        [AllowAnonymous]
        public async Task<IHttpActionResult> EditUserAccount(UserAccount editUserAccount)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);

            ApplicationUser applicationUser = manager.FindById(editUserAccount.Id);
            if (applicationUser == null)
            {
                return NotFound();
            }

            string roleId = applicationUser.Roles.SingleOrDefault()?.RoleId;
            string roleName = _context.Roles.SingleOrDefault(r => r.Id == roleId)?.Name;

            if (roleName != editUserAccount.RoleName)
            {
                manager.RemoveFromRole(applicationUser.Id, roleName);
                manager.AddToRole(applicationUser.Id, editUserAccount.RoleName);
            }
                       
            applicationUser.UserName = editUserAccount.UserName;
            applicationUser.FullName = editUserAccount.FullName;
            applicationUser.Email = editUserAccount.Email;
            applicationUser.PhoneNumber = editUserAccount.PhoneNumber;
            await manager.UpdateAsync(applicationUser);

            return Ok();
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


                MailMessage msg = new System.Net.Mail.MailMessage();
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

                string callbackUrl = string.Format("http://www.google.com?userAccountId={0}&code={1}", user.Id, code);
                manager.SendEmail(user.Id, "Reset Password", "Please reset your password by clicking <a href=\"" + callbackUrl + "\">here</a>");

                return "User Name Found";
            }
            return "User Name Not Found";
        }

        [HttpPost]
        [Route("api/NewPassword")]
        [AllowAnonymous]
        public async Task<IHttpActionResult> NewPassword(ForgotPassword forgotPassword)
        {
            UserStore<ApplicationUser> userStore = new UserStore<ApplicationUser>(new ApplicationDbContext());
            UserManager<ApplicationUser> manager = new UserManager<ApplicationUser>(userStore);
            DpapiDataProtectionProvider provider = new DpapiDataProtectionProvider("Sample");

            manager.UserTokenProvider = new DataProtectorTokenProvider<ApplicationUser>(provider.Create("EmailConfirmation"));
            ApplicationUser user = manager.FindById(forgotPassword.Id);
            if (user != null)
            {
                string hashedNewPassword = manager.PasswordHasher.HashPassword(forgotPassword.NewPassword);
                await userStore.SetPasswordHashAsync(user, hashedNewPassword);
                await userStore.UpdateAsync(user);
                return Ok();
            }
            return NotFound();
        }

        // GET api/Account/UserInfo
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("UserInfo")]
        public UserInfoViewModel GetUserInfo()
        {
            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            return new UserInfoViewModel
            {
                Email = User.Identity.GetUserName(),
                HasRegistered = externalLogin == null,
                LoginProvider = externalLogin != null ? externalLogin.LoginProvider : null
            };
        }

        // POST api/Account/Logout
        [Route("Logout")]
        public IHttpActionResult Logout()
        {
            Authentication.SignOut(CookieAuthenticationDefaults.AuthenticationType);
            return Ok();
        }

        // GET api/Account/ManageInfo?returnUrl=%2F&generateState=true
        [Route("ManageInfo")]
        public async Task<ManageInfoViewModel> GetManageInfo(string returnUrl, bool generateState = false)
        {
            IdentityUser user = await UserManager.FindByIdAsync(User.Identity.GetUserId());

            if (user == null)
            {
                return null;
            }

            List<UserLoginInfoViewModel> logins = new List<UserLoginInfoViewModel>();

            foreach (IdentityUserLogin linkedAccount in user.Logins)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = linkedAccount.LoginProvider,
                    ProviderKey = linkedAccount.ProviderKey
                });
            }

            if (user.PasswordHash != null)
            {
                logins.Add(new UserLoginInfoViewModel
                {
                    LoginProvider = LocalLoginProvider,
                    ProviderKey = user.UserName,
                });
            }

            return new ManageInfoViewModel
            {
                LocalLoginProvider = LocalLoginProvider,
                Email = user.UserName,
                Logins = logins,
                ExternalLoginProviders = GetExternalLogins(returnUrl, generateState)
            };
        }

        // POST api/Account/ChangePassword
        [Route("ChangePassword")]
        public async Task<IHttpActionResult> ChangePassword(ChangePasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.ChangePasswordAsync(User.Identity.GetUserId(), model.OldPassword,
                model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/SetPassword
        [Route("SetPassword")]
        public async Task<IHttpActionResult> SetPassword(SetPasswordBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result = await UserManager.AddPasswordAsync(User.Identity.GetUserId(), model.NewPassword);

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/AddExternalLogin
        [Route("AddExternalLogin")]
        public async Task<IHttpActionResult> AddExternalLogin(AddExternalLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

            AuthenticationTicket ticket = AccessTokenFormat.Unprotect(model.ExternalAccessToken);

            if (ticket == null || ticket.Identity == null || (ticket.Properties != null
                && ticket.Properties.ExpiresUtc.HasValue
                && ticket.Properties.ExpiresUtc.Value < DateTimeOffset.UtcNow))
            {
                return BadRequest("External login failure.");
            }

            ExternalLoginData externalData = ExternalLoginData.FromIdentity(ticket.Identity);

            if (externalData == null)
            {
                return BadRequest("The external login is already associated with an account.");
            }

            IdentityResult result = await UserManager.AddLoginAsync(User.Identity.GetUserId(),
                new UserLoginInfo(externalData.LoginProvider, externalData.ProviderKey));

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // POST api/Account/RemoveLogin
        [Route("RemoveLogin")]
        public async Task<IHttpActionResult> RemoveLogin(RemoveLoginBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            IdentityResult result;

            if (model.LoginProvider == LocalLoginProvider)
            {
                result = await UserManager.RemovePasswordAsync(User.Identity.GetUserId());
            }
            else
            {
                result = await UserManager.RemoveLoginAsync(User.Identity.GetUserId(),
                    new UserLoginInfo(model.LoginProvider, model.ProviderKey));
            }

            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogin
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalCookie)]
        [AllowAnonymous]
        [Route("ExternalLogin", Name = "ExternalLogin")]
        public async Task<IHttpActionResult> GetExternalLogin(string provider, string error = null)
        {
            if (error != null)
            {
                return Redirect(Url.Content("~/") + "#error=" + Uri.EscapeDataString(error));
            }

            if (!User.Identity.IsAuthenticated)
            {
                return new ChallengeResult(provider, this);
            }

            ExternalLoginData externalLogin = ExternalLoginData.FromIdentity(User.Identity as ClaimsIdentity);

            if (externalLogin == null)
            {
                return InternalServerError();
            }

            if (externalLogin.LoginProvider != provider)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);
                return new ChallengeResult(provider, this);
            }

            ApplicationUser user = await UserManager.FindAsync(new UserLoginInfo(externalLogin.LoginProvider,
                externalLogin.ProviderKey));

            bool hasRegistered = user != null;

            if (hasRegistered)
            {
                Authentication.SignOut(DefaultAuthenticationTypes.ExternalCookie);

                ClaimsIdentity oAuthIdentity = await user.GenerateUserIdentityAsync(UserManager,
                   OAuthDefaults.AuthenticationType);
                ClaimsIdentity cookieIdentity = await user.GenerateUserIdentityAsync(UserManager,
                    CookieAuthenticationDefaults.AuthenticationType);

               // AuthenticationProperties properties = ApplicationOAuthProvider.CreateProperties(user.UserName);
              //  Authentication.SignIn(properties, oAuthIdentity, cookieIdentity);
            }
            else
            {
                IEnumerable<Claim> claims = externalLogin.GetClaims();
                ClaimsIdentity identity = new ClaimsIdentity(claims, OAuthDefaults.AuthenticationType);
                Authentication.SignIn(identity);
            }

            return Ok();
        }

        // GET api/Account/ExternalLogins?returnUrl=%2F&generateState=true
        [AllowAnonymous]
        [Route("ExternalLogins")]
        public IEnumerable<ExternalLoginViewModel> GetExternalLogins(string returnUrl, bool generateState = false)
        {
            IEnumerable<AuthenticationDescription> descriptions = Authentication.GetExternalAuthenticationTypes();
            List<ExternalLoginViewModel> logins = new List<ExternalLoginViewModel>();

            string state;

            if (generateState)
            {
                const int strengthInBits = 256;
                state = RandomOAuthStateGenerator.Generate(strengthInBits);
            }
            else
            {
                state = null;
            }

            foreach (AuthenticationDescription description in descriptions)
            {
                ExternalLoginViewModel login = new ExternalLoginViewModel
                {
                    Name = description.Caption,
                    Url = Url.Route("ExternalLogin", new
                    {
                        provider = description.AuthenticationType,
                        response_type = "token",
                        client_id = Startup.PublicClientId,
                        redirect_uri = new Uri(Request.RequestUri, returnUrl).AbsoluteUri,
                        state = state
                    }),
                    State = state
                };
                logins.Add(login);
            }

            return logins;
        }

       
        

        // POST api/Account/RegisterExternal
        [OverrideAuthentication]
        [HostAuthentication(DefaultAuthenticationTypes.ExternalBearer)]
        [Route("RegisterExternal")]
        public async Task<IHttpActionResult> RegisterExternal(RegisterExternalBindingModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var info = await Authentication.GetExternalLoginInfoAsync();
            if (info == null)
            {
                return InternalServerError();
            }

            var user = new ApplicationUser() { UserName = model.Email, Email = model.Email };

            IdentityResult result = await UserManager.CreateAsync(user);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }

            result = await UserManager.AddLoginAsync(user.Id, info.Login);
            if (!result.Succeeded)
            {
                return GetErrorResult(result);
            }
            return Ok();
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing && _userManager != null)
            {
                _userManager.Dispose();
                _userManager = null;
            }

            base.Dispose(disposing);
        }

        #region Helpers

        private IAuthenticationManager Authentication
        {
            get { return Request.GetOwinContext().Authentication; }
        }

        private IHttpActionResult GetErrorResult(IdentityResult result)
        {
            if (result == null)
            {
                return InternalServerError();
            }

            if (!result.Succeeded)
            {
                if (result.Errors != null)
                {
                    foreach (string error in result.Errors)
                    {
                        ModelState.AddModelError("", error);
                    }
                }

                if (ModelState.IsValid)
                {
                    // No ModelState errors are available to send, so just return an empty BadRequest.
                    return BadRequest();
                }

                return BadRequest(ModelState);
            }

            return null;
        }

        private class ExternalLoginData
        {
            public string LoginProvider { get; set; }
            public string ProviderKey { get; set; }
            public string UserName { get; set; }

            public IList<Claim> GetClaims()
            {
                IList<Claim> claims = new List<Claim>();
                claims.Add(new Claim(ClaimTypes.NameIdentifier, ProviderKey, null, LoginProvider));

                if (UserName != null)
                {
                    claims.Add(new Claim(ClaimTypes.Name, UserName, null, LoginProvider));
                }

                return claims;
            }

            public static ExternalLoginData FromIdentity(ClaimsIdentity identity)
            {
                if (identity == null)
                {
                    return null;
                }

                Claim providerKeyClaim = identity.FindFirst(ClaimTypes.NameIdentifier);

                if (providerKeyClaim == null || String.IsNullOrEmpty(providerKeyClaim.Issuer)
                    || String.IsNullOrEmpty(providerKeyClaim.Value))
                {
                    return null;
                }

                if (providerKeyClaim.Issuer == ClaimsIdentity.DefaultIssuer)
                {
                    return null;
                }

                return new ExternalLoginData
                {
                    LoginProvider = providerKeyClaim.Issuer,
                    ProviderKey = providerKeyClaim.Value,
                    UserName = identity.FindFirstValue(ClaimTypes.Name)
                };
            }
        }

        private static class RandomOAuthStateGenerator
        {
            private static RandomNumberGenerator _random = new RNGCryptoServiceProvider();

            public static string Generate(int strengthInBits)
            {
                const int bitsPerByte = 8;

                if (strengthInBits % bitsPerByte != 0)
                {
                    throw new ArgumentException("strengthInBits must be evenly divisible by 8.", "strengthInBits");
                }

                int strengthInBytes = strengthInBits / bitsPerByte;

                byte[] data = new byte[strengthInBytes];
                _random.GetBytes(data);
                return HttpServerUtility.UrlTokenEncode(data);
            }
        }

        #endregion
    }
}
