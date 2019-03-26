using System.Web.Mvc;

using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.Infra;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.Utils;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    public class HomeController: Cruder<Dinner,DinnerInput>
    {
        private readonly ICacheManager cache;
        public HomeController(ICrudService<Dinner> service, IProMapper v, ICacheManager cache) : base(service, v)
        {
            this.cache = cache;
        }

        public ActionResult About()
        {
            return PartialView();
        }

        protected override string RowViewName => "ListItems/Dinner";

        public override ActionResult Create()
        {
            var vm = mapper.Map<Dinner, DinnerInput>(new Dinner());
            vm.Duration = 20;
            return PartialView(vm);
        }

        protected override void OnCrud()
        {
            cache.RemoveGroup(nameof(Dinner));
            base.OnCrud();
        }
    }
}