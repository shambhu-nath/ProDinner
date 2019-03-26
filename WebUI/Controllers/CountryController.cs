using System;
using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.Utils;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    public class CountryController : Cruder<Country, CountryInput>
    {
        public CountryController(ICrudService<Country> service, IProMapper v)
            : base(service, v)
        {
        }

        public ActionResult LookupGrid()
        {
            return PartialView();
        }

        [HttpPost]
        public ActionResult BatchRestore(int[] ids)
        {
            if (WebUtils.IsUserAdmin())
            {
                service.BatchRestore(ids);
            }

            return Json(new { });
        }

        public ActionResult BatchDelete(int[] ids)
        {
            return PartialView(new BatchDeleteConfirmInput { Ids = ids });
        }

        [HttpPost]
        public ActionResult BatchDelete(BatchDeleteConfirmInput input)
        {
            service.BatchDelete(input.Ids);
            return Json(new { });
        }

        [HttpPost]
        public ActionResult GridGetItems(GridParams g, string parent, bool? restore)
        {
            var isAdmin = WebUtils.IsUserAdmin();

            var data = service.GetAll(isAdmin).Where(o => o.Name.StartsWith(parent));

            if (restore.HasValue && isAdmin)
            {
                service.Restore(Convert.ToInt32(g.Key));
            }

            var model = new GridModelBuilder<Country>(data.AsQueryable(), g)
            {
                Key = "Id",
                Map = MapEntityToGridModel,
                GetItem = () => service.Get(Convert.ToInt32(g.Key))
            }.Build();

            return Json(model);
        }

        /// <summary>
        /// view name for CountryLookup to render items
        /// </summary>
        protected override string RowViewName
        {
            get
            {
                return "ListItems/Country";
            }
        }
    }
}