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
    [JsonAllowGet]
    public class DinnersAjaxListController : Controller
    {
        private readonly IRepo<Dinner> repo;
        private readonly ICacheManager cache;

        public DinnersAjaxListController(IRepo<Dinner> repo, ICacheManager cache)
        {
            this.repo = repo;
            this.cache = cache;
        }

        public ActionResult Search(string search, int? chef, int[] meals, int? pivot)
        {
            AjaxListResult res;

            Func<AjaxListResult> getData = () =>
            {
                var pageSize = 7;
                var list = repo.GetAll(WebUtils.IsUserAdmin()).Where(o => o.Name.Contains(search));

                if (chef.HasValue) list = list.Where(o => o.ChefId == chef.Value);
                if (meals != null) list = list.Where(o => meals.All(m => o.Meals.Select(g => g.Id).Contains(m)));
                list = list.OrderByDescending(o => o.Id);

                var items = (pivot.HasValue ? list.Where(o => o.Id <= pivot.Value) : list).Take(pageSize + 1).ToList();
                var isMore = items.Count > pageSize;

                var result = new AjaxListResult
                {
                    Content = this.RenderPartialView("ListItems/Dinner", items.Take(pageSize).ToList()),
                    More = isMore
                };

                if (isMore)
                {
                    result.Pivot = items.Last().Id;
                }

                return result;
            };

            if (!WebUtils.IsUserAdmin() && search == "" && chef == null && meals == null && pivot == null)
            {
                res = cache.Get("dinnersList", () => getData(), nameof(Dinner));
            }
            else
            {
                res = getData();
            }

            return Json(res);
        }
    }
}