using System.Web.Mvc;
using Omu.Awem.Utils;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    public class CountryInlineEditController : Controller
    {
        private readonly IProMapper mapper;
        private readonly ICrudService<Country> countryService;

        public CountryInlineEditController(IProMapper mapper, ICrudService<Country> countryService)
        {
            this.mapper = mapper;
            this.countryService = countryService;
        }

        [HttpPost]
        public ActionResult Create(CountryInput input)
        {
            if (ModelState.IsValid)
            {
                var country = mapper.Map<CountryInput, Country>(input);
                var id = countryService.Create(country);
                country = countryService.Get(id);

                return Json(new { Item = country });
            }

            return Json(ModelState.GetErrorsInline());
        }

        [HttpPost]
        public virtual ActionResult Edit(CountryInput input)
        {
            if (ModelState.IsValid)
            {
                mapper.Map<CountryInput, Country>(input, countryService.Get(input.Id.Value));
                countryService.Save();

                return Json(new { });
            }

            return Json(ModelState.GetErrorsInline());
        }
    }
}