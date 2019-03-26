using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.WebUI.Utils;

namespace Omu.ProDinner.WebUI.Controllers.Awesome.MultiLookup
{
    [JsonAllowGet]
    public class MealsMultiLookupController : Controller
    {
        private readonly IRepo<Meal> repo;

        public MealsMultiLookupController(IRepo<Meal> repo)
        {
            this.repo = repo;
        }

        public ActionResult Search(string search, int[] selected, int? pageSize, int? pivot, int page = 1)
        {
            var ps = pageSize ?? 10;
            var list = repo.GetAll().Where(o => o.Name.Contains(search));

            if (selected != null) list = list.Where(o => !selected.Contains(o.Id)).AsQueryable();
            list = list.OrderByDescending(o => o.Id);

            var items = (pivot.HasValue ? list.Where(o => o.Id <= pivot.Value) : list).Take(ps + 1).ToList();
            var isMore = items.Count > ps;

            var result = new AjaxListResult
            {
                Content = this.RenderPartialView("ListItems/MealLookupItem", items.Take(ps).ToList()),
                More = isMore
            };

            if (isMore)
            {
                result.Pivot = items.Last().Id;
            }

            return Json(result);
        }

        public ActionResult Selected(int[] selected)
        {
            selected = selected ?? new int[] {};
            var items = repo.GetAll().Where(o => selected.Contains(o.Id)).ToList();
                        

            return Json(new AjaxListResult
            {
                Content = this.RenderPartialView("ListItems/MealLookupItem", items)
            });
        }

        public ActionResult GetItems(int[] v)
        {
            v = v ?? new int[] {};
            return Json(repo.GetAll().Where(o => v.Contains(o.Id)).ToArray()
                .Select(o => new KeyContent
            {
                Key = o.Id,
                Content = @"<img  src='" + Url.Content("~/pictures/Meals/" + Pic(o.Picture)) + "' class='mthumb' />" + o.Name,
                Encode = false
            }));
        }

        private static string Pic(string o)
        {
            return string.IsNullOrEmpty(o) ? "m0.jpg" : "m" + o;
        }
    }
}