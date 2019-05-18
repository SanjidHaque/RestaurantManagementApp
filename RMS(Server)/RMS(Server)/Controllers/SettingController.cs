using System.Linq;
using System.Web.Http;
using RMS_Server_.Models;

namespace RMS_Server_.Controllers
{
    public class SettingController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private SettingController()
        {
            _context = new ApplicationDbContext();
        }

        [HttpGet]
        [AllowAnonymous]
        [Route("api/GetAllSetting")]
        public IHttpActionResult GetAllSetting()
        {
            Setting setting = _context.Settings.FirstOrDefault();
            return Ok(setting);
        }

        [HttpPut]
        [AllowAnonymous]
        [Route("api/EditSetting")]
        public IHttpActionResult EditSetting(Setting editSetting)
        {
            Setting setting = _context.Settings.FirstOrDefault();
            if (setting != null)
            {
                setting.ShopName = editSetting.ShopName;
                setting.ShopAddress = editSetting.ShopAddress;
                setting.ShopPhone = editSetting.ShopPhone;
                setting.ShopEmail = editSetting.ShopEmail;
                setting.ShopFacebookPage = editSetting.ShopFacebookPage;
                setting.VatAmount = editSetting.VatAmount;
                setting.VatRegNumber = editSetting.VatRegNumber;
                setting.VatType = editSetting.VatType;
                setting.ServiceCharge = editSetting.ServiceCharge;
                setting.AdditionalInformation = editSetting.AdditionalInformation;
                _context.SaveChanges();
                return Ok();
            }

            return NotFound();
        }
    }
}
