using FakeItEasy;
using NUnit.Framework;
using Omu.ProDinner.Core;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.Controllers;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.Tests
{
    public class CruderControllerTests
    {
        CountryController countryController;

        IProMapper mapper;

        ICrudService<Country> countryCrudSrv;

        [SetUp]
        public void SetUp()
        {
            mapper = A.Fake<IProMapper>();
            countryCrudSrv = A.Fake<ICrudService<Country>>();
            countryController = new CountryController(countryCrudSrv, mapper);
        }

        [Test]
        public void CreateShouldBuildNewInput()
        {
            countryController.Create();
            A.CallTo(() => mapper.Map<Country, CountryInput>(A<Country>.Ignored, null)).MustHaveHappened();
        }

        [Test]
        public void CreateShouldReturnViewForInvalidModelstate()
        {
            countryController.ModelState.AddModelError("", "");
            countryController.Create(A.Fake<CountryInput>(), null).ShouldBePartialViewResult();
        }

        [Test]
        public void EditShouldReturnCreateView()
        {
            A.CallTo(() => countryCrudSrv.Get(1)).Returns(A.Fake<Country>());

            countryController.Edit(1).ShouldBePartialViewResult().ShouldBeCreate();

            A.CallTo(() => countryCrudSrv.Get(1)).MustHaveHappened();
        }

        [Test]
        public void EditShouldReturnViewForInvalidModelstate()
        {
            countryController.ModelState.AddModelError("", "");
            countryController.Edit(A.Fake<CountryInput>(), null).ShouldBePartialViewResult().ShouldBeCreate();
        }

        [Test]
        public void EditShouldReturnContentOnError()
        {
            A.CallTo(() => mapper.Map<CountryInput, Country>(A<CountryInput>.Ignored, A<Country>.Ignored)).Throws(new ProDinnerException("aa"));
            countryController.Edit(new CountryInput { Id = 1 }, null).ShouldBeContent().Content.ShouldEqual("aa");
        }

        [Test]
        public void DeleteShouldReturnView()
        {
            countryController.Delete(1, "").ShouldBePartialViewResult();
        }

        [Test]
        public void DeleteShouldDeleteEntity()
        {
            var input = new DeleteConfirmInput { Id = 123 };

            countryController.Delete(input).ShouldBeJson();
            A.CallTo(() => countryCrudSrv.Delete(input.Id)).MustHaveHappened();
        }
    }
}