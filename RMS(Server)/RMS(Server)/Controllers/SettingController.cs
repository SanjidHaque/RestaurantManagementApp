using System.Data.Entity;
using System.Linq;
using System.Web.Http;
using RMS_Server_.Models;
using RMS_Server_.Services;

namespace RMS_Server_.Controllers
{
    public class SettingController : ApiController
    {
        private readonly ApplicationDbContext _context;
        private readonly StatusTextService _statusTextService;

        private SettingController()
        {
            _context = new ApplicationDbContext();
            _statusTextService = new StatusTextService();
        }

        [HttpGet]
        [Route("api/GetAllSetting")]
        public IHttpActionResult GetAllSetting()
        {
            Setting setting = _context.Settings.FirstOrDefault();
            return Ok(setting);
        }

        [HttpPut]
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
                setting.VatRate = editSetting.VatRate;
                setting.VatRegNumber = editSetting.VatRegNumber;
                setting.VatType = editSetting.VatType;
                setting.ServiceChargeRate = editSetting.ServiceChargeRate;
                setting.AdditionalInformation = editSetting.AdditionalInformation;
                setting.PrintChefsOrderReceipt = editSetting.PrintChefsOrderReceipt;

                _context.Entry(setting).State = EntityState.Modified;
                _context.SaveChanges();
                return Ok(new { StatusText = _statusTextService.Success });
            }

            return Ok(new { StatusText = _statusTextService.ResourceNotFound });
        }
    }
}
