using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.Infra;
using Omu.ProDinner.Resources;
using Omu.ProDinner.WebUI.Utils;

namespace Omu.ProDinner.WebUI.Controllers.Awesome
{
    [JsonAllowGet]
    public class DataController : Controller
    {
        private readonly ICacheManager cache;
        private readonly IUniRepo repo;

        public DataController(IUniRepo repo, ICacheManager cache)
        {
            this.repo = repo;
            this.cache = cache;
        }

        public ActionResult GetChefs(bool? any)
        {
            var items = new List<KeyContent>();

            if (any.HasValue)
            {
                items.Insert(0, new KeyContent(string.Empty, Mui.any));
            }

            Func<List<KeyContent>> getData = () =>
            {
                return repo.GetAll<Chef>(WebUtils.IsUserAdmin()).ToArray()
                    .Select(o => new KeyContent(o.Id, $"{o.FirstName} {o.LastName}")).ToList();
            };

            var res = !WebUtils.IsUserAdmin() ? cache.Get("chefs1", () => getData(), nameof(Chef)) : getData();

            items.AddRange(res);

            return Json(items);
        }

        public ActionResult GetCountries()
        {
            var items = repo.GetAll<Country>(WebUtils.IsUserAdmin()).ToArray()
                .Select(o => new KeyContent(o.Id, o.Name));
            return Json(items);
        }

        public ActionResult GetDinners(string term, int? chef, int[] meals)
        {
            var query = repo.GetAll<Dinner>(WebUtils.IsUserAdmin())
                            .Where(o => o.Name.Contains(term));

            if (chef.HasValue) query = query.Where(o => o.ChefId == chef);
            if (meals != null) query = query.Where(o => meals.All(m => o.Meals.Select(g => g.Id).Contains(m)));

            var list = query.ToList();

            return Json(list.Select(i => new KeyContent { Content = i.Name, Key = i.Id }).Take(5));
        }

        public ActionResult GetDinnersAuto(string v, int? chef, int[] meals)
        {
            var query = repo.GetAll<Dinner>(WebUtils.IsUserAdmin())
                .Where(o => o.Name.Contains(v));

            if (chef.HasValue) query = query.Where(o => o.ChefId == chef);
            if (meals != null) query = query.Where(o => meals.All(m => o.Meals.Select(g => g.Id).Contains(m)));

            var list = query.ToList();

            return Json(list.Select(i => new KeyContent { Content = i.Name, Key = i.Id }).Take(5));
        }

        public ActionResult GetCountryItem(int? v)
        {
            Check.NotNull(v, "v");

            var country = repo.Get<Country>(v.Value);

            return Json(new KeyContent(country.Id, country.Name));
        }
    }
}