using System;
using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.Infra;
using Omu.ProDinner.WebUI.Utils;

namespace Omu.ProDinner.WebUI.Controllers.Awesome.AjaxList
{
    public class MealsAjaxListController : Controller
    {
        private readonly IRepo<Meal> repo;
        private readonly ICacheManager cache;

        public MealsAjaxListController(IRepo<Meal> repo, ICacheManager cache)
        {
            this.repo = repo;
            this.cache = cache;
        }

        [JsonAllowGet]
        public ActionResult Search(string search, int? pivot, int pageSize = 10)
        {
            AjaxListResult res;

            Func<AjaxListResult> getData = () =>
            {
                var list = repo.GetAll(WebUtils.IsUserAdmin()).Where(o => o.Name.Contains(search))
                    .OrderByDescending(o => o.Id);

                var items = (pivot.HasValue ? list.Where(o => o.Id <= pivot.Value) : list).Take(pageSize + 1).ToList();
                var isMore = items.Count > pageSize;

                var result = new AjaxListResult
                {
                    Content = this.RenderPartialView("ListItems/Meal", items.Take(pageSize).ToList()),
                    More = isMore
                };

                if (isMore)
                {
                    result.Pivot = items.Last().Id;
                }

                return result;
            };

            if (!WebUtils.IsUserAdmin() && search == "" && pivot == null)
            {
                res = cache.Get("mealsList&ps="+ pageSize, () => getData(), nameof(Meal));
            }
            else
            {
                res = getData();
            }
            
            return Json(res);
        }
    }
}