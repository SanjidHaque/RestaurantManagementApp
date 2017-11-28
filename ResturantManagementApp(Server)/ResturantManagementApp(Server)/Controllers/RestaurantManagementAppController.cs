using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ResturantManagementApp_Server_.Models;

namespace ResturantManagementApp_Server_.Controllers
{
    public class RestaurantManagementAppController : ApiController
    {
        public ApplicationDbContext _Context;

        public RestaurantManagementAppController()
        {
            _Context = new ApplicationDbContext();
        }
        [Route("api/GetsSetMenus")]
        public IEnumerable<SetMenu> GetsSetMenus()
        {
            return _Context.SetMenus.ToList();

        }

        [Route("api/GetSetMenu/{id:int}")]
        public SetMenu GetSetMenu(int id)
        {
            return _Context.SetMenus.FirstOrDefault(p => p.Id == id);
            //return _Context.SetMenuIngredientses.FirstOrDefault(p => p.Id == id).ToList();
        }

        public IEnumerable<SetMenuIngredients> GetsSetMenuIngredientses(int id)
        {
            return _Context.SetMenuIngredientses.ToList();
            
        }
        [Route("api/GetsSetMenu/{id:int}")]
        public SetMenuIngredients GetsSetMenu(int id)
        {
            /*var result = _Context.SetMenuIngredientses.GroupBy(
                p => p.Id,
                (Key,g) => new {id = Key,SetMenuIngredients = g.ToList()});*/
            return _Context.SetMenuIngredientses.FirstOrDefault(p => p.Id == id);

        }
    }
}
