using System;
using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.Infra;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.Utils;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    public class DinnerController : Cruder<Dinner, DinnerInput>
    {
        private readonly ICacheManager cache;
        public DinnerController(ICrudService<Dinner> service, IProMapper mapper, ICacheManager cache)
            : base(service, mapper)
        {
            this.cache = cache;
        }

        protected override object MapEntityToGridModel(Dinner o)
        {
            return new
                {
                    o.Id, 
                    o.IsDeleted, 
                    o.Name,
                    CountryName = o.Country.Name,
                    ChefName = o.Chef.FirstName + " " + o.Chef.LastName,
                    o.Address,
                    MealsCount = o.Meals.Count
                };
        }

        [HttpPost]
        public ActionResult GridGetItems(GridParams g, string parent, bool? restore)
        {
            var isAdmin = WebUtils.IsUserAdmin();

            var data = service.GetAll(isAdmin).Where(o => o.Name.Contains(parent));

            if (restore.HasValue && isAdmin)
            {
                service.Restore(Convert.ToInt32(g.Key));
                OnCrud();
            }

            var model = new GridModelBuilder<Dinner>(data, g)
                {
                    KeyProp = o => o.Id,
                    Map = MapEntityToGridModel,
                    GetItem = () => service.Get(Convert.ToInt32(g.Key))
                    
                }.Build();

            return Json(model);
        }

        public ActionResult Details(int key)
        {
            var dinner = service.Get(key);
            return PartialView(dinner);
        }

        protected override void OnCrud()
        {
            cache.RemoveGroup(nameof(Dinner));
            base.OnCrud();
        }
    }
}