using System;
using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.Infra;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.Utils;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    public class ChefController : Cruder<Chef, ChefInput>
    {
        private readonly IRepo<Chef> chefRepo;
        private readonly ICacheManager cache;

        public ChefController(ICrudService<Chef> service, IProMapper mapper, IRepo<Chef> chefRepo, ICacheManager cache)
            : base(service, mapper)
        {
            this.chefRepo = chefRepo;
            this.cache = cache;
        }

        protected override object MapEntityToGridModel(Chef chef)
        {
            return new { chef.Id, chef.FirstName, chef.LastName, Country = chef.Country.Name, chef.IsDeleted };
        }

        [HttpPost]
        public ActionResult GridGetItems(GridParams g, string parent, bool? restore)
        {
            var isAdmin = WebUtils.IsUserAdmin();

            var data = chefRepo.GetAll(isAdmin).Where(o => o.FirstName.StartsWith(parent) || o.LastName.StartsWith(parent));

            if (restore.HasValue && isAdmin)
            {
                service.Restore(Convert.ToInt32(g.Key));
                OnCrud();
            }

            var model = new GridModelBuilder<Chef>(data.AsQueryable(), g)
                    {
                        Key = "Id",
                        Map = MapEntityToGridModel,
                        GetItem = () => chefRepo.Get(Convert.ToInt32(g.Key))
                    }.Build();

            return Json(model);
        }

        protected override void OnCrud()
        {
            cache.RemoveGroup(nameof(Chef));
            base.OnCrud();
        }
    }
}