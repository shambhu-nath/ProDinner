using System;
using System.Web;
using System.Web.Mvc;
using Omu.AwesomeMvc;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.Infra;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.Utils;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    public class MealController : Cruder<Meal, MealInput>
    {
        private new readonly IMealService service;
        private readonly IFileManagerService fileManagerService;
        private readonly ICacheManager cache;

        public MealController(IMealService service, IProMapper mapper, IFileManagerService fileManagerService, ICacheManager cache)
            : base(service, mapper)
        {
            this.service = service;
            this.fileManagerService = fileManagerService;
            this.cache = cache;
        }

        public ActionResult Grid()
        {
            return View();
        }

        [HttpPost]
        public ActionResult GetGridData(GridParams g, bool? restore)
        {
            var isAdmin = WebUtils.IsUserAdmin();

            var data = service.GetAll(isAdmin);

            if (restore.HasValue && isAdmin)
            {
                OnCrud();
                service.Restore(Convert.ToInt32(g.Key));
            }

            var model = new GridModelBuilder<Meal>(data, g)
            {
                KeyProp = o => o.Id,
                Map = o => new { o.Id, o.Name, o.Comments, o.Picture, o.IsDeleted },
                GetItem = () => service.Get(Convert.ToInt32(g.Key))
            }.Build();

            return Json(model);
        }

        public override ActionResult Index()
        {
            return View();
        }

        protected override string RowViewName => "ListItems/Meal";

        public ActionResult GetMeal(int id)
        {
            return Json(new { Id = id, Content = this.RenderPartialView(RowViewName, new[] { service.Get(id) }) });
        }

        [HttpPost]
        public ActionResult Upload(HttpPostedFileBase file)
        {
            int w, h;
            var name = fileManagerService.SaveTempJpeg(Globals.PicturesPath, file.InputStream, out w, out h);
            return Json(new { name, type = file.ContentType, size = file.ContentLength, w, h });
        }

        public ActionResult ChangePicture(int id, string gridId)
        {
            ViewData["gridId"] = gridId;
            return PartialView(service.Get(id));
        }

        [HttpPost]
        public ActionResult Crop(int x, int y, int w, int h, string filename, int id)
        {
            service.SetPicture(id, Globals.PicturesPath, filename, x, y, w, h);
            OnCrud();
            return Json(new { name = filename });
        }

        protected override void OnCrud()
        {
            cache.RemoveGroup(nameof(Meal));
            base.OnCrud();
        }

        #region used only by browsers that don't support drag and drop upload

        public ActionResult OChangePicture(int id)
        {
            return View(service.Get(id));
        }

        [HttpPost]
        public ActionResult OChangePicture()
        {
            var file = Request.Files["fileUpload"];
            var id = Convert.ToInt32(Request.Form["id"]);

            if (file.ContentLength > 0)
            {
                int w, h;
                var name = fileManagerService.SaveTempJpeg(Globals.PicturesPath, file.InputStream, out w, out h);
                return RedirectToAction("ocrop",
                                        new CropInput { ImageWidth = w, ImageHeight = h, Id = id, FileName = name });
            }

            return RedirectToAction("Index");
        }

        public ActionResult OCrop(CropInput cropDisplay)
        {
            return View(cropDisplay);
        }

        [HttpPost]
        public ActionResult OCrop(int x, int y, int w, int h, int id, string filename)
        {
            service.SetPicture(id, Globals.PicturesPath, filename, x, y, w, h);
            return RedirectToAction("ochangepicture", new { id });
        }

        #endregion
    }
}