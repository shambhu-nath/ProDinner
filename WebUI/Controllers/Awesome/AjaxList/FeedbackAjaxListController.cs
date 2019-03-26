using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.WebUI.Utils;

namespace Omu.ProDinner.WebUI.Controllers.Awesome.AjaxList
{
    public class FeedbackAjaxListController : Controller
    {
        private readonly IUniRepo repo;

        public FeedbackAjaxListController(IUniRepo repo)
        {
            this.repo = repo;
        }

        [JsonAllowGet]
        public ActionResult Search(string search, int? pivot)
        {
            var pageSize = 7;
            var list = repo.GetAll<Feedback>().OrderByDescending(o => o.Id);

            var items = (pivot.HasValue ? list.Where(o => o.Id <= pivot.Value) : list).Take(pageSize + 1).ToList();
            var isMore = items.Count > pageSize;

            var result = new AjaxListResult
            {
                Content = this.RenderPartialView("ListItems/Feedback", items.Take(pageSize).ToList()),
                More = isMore
            };

            if (isMore)
            {
                result.Pivot = items.Last().Id;
            }

            return Json(result);
        }
    }
}