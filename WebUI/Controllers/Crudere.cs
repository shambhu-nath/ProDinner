using System.Web.Mvc;
using System.Web.UI;
using Omu.AwesomeMvc;
using Omu.ProDinner.Core;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Service;
using Omu.ProDinner.Resources;
using Omu.ProDinner.WebUI.Mappers;
using Omu.ProDinner.WebUI.ViewModels.Input;

namespace Omu.ProDinner.WebUI.Controllers
{
    /// <summary>
    /// generic crud controller for entities where there is difference between the edit and create view;
    /// used to do crud with both the grid and the ajaxlist
    /// </summary>
    /// <typeparam name="TEntity"> the entity</typeparam>
    /// <typeparam name="TCreateInput">create viewmodel</typeparam>
    /// <typeparam name="TEditInput">edit viewmodel</typeparam>
    public abstract class Crudere<TEntity, TCreateInput, TEditInput> : Controller
        where TCreateInput : new()
        where TEditInput : Input, new()
        where TEntity : DelEntity, new()
    {
        protected readonly ICrudService<TEntity> service;

        protected readonly IProMapper mapper;

        protected virtual string EditView => "edit";

        public Crudere(ICrudService<TEntity> service, IProMapper mapper)
        {
            this.service = service;
            this.mapper = mapper;
        }

        public virtual ActionResult Index()
        {
            return View();
        }

        public virtual ActionResult Create()
        {
            return PartialView(mapper.Map<TEntity, TCreateInput>(new TEntity()));
        }

        [HttpPost]
        public ActionResult Create(TCreateInput input, bool? usingAjaxList)
        {
            if (!ModelState.IsValid)
            {
                return PartialView(input);
            }

            var id = service.Create(mapper.Map<TCreateInput, TEntity>(input));
            OnCrud();
            var entity = service.Get(id);

            if (usingAjaxList.HasValue)
            {
                return Json(new { Content = this.RenderPartialView(RowViewName, new[] { entity }) });
            }

            return Json(MapEntityToGridModel(entity));
        }

        [OutputCache(Location = OutputCacheLocation.None)]//for ie
        public ActionResult Edit(int id)
        {
            var entity = service.Get(id);
            return PartialView(EditView, mapper.Map<TEntity, TEditInput>(entity));
        }

        [HttpPost]
        public virtual ActionResult Edit(TEditInput input, bool? usingAjaxList)
        {
            try
            {
                if (!ModelState.IsValid)
                {
                    return PartialView(EditView, input);
                }

                var entity = mapper.Map<TEditInput, TEntity>(input, service.Get(input.Id.Value));
                service.Save();
                OnCrud();

                if (usingAjaxList.HasValue)
                {
                    return Json(new { input.Id, Content = this.RenderPartialView(RowViewName, new[] { entity }) });
                }

                return Json(MapEntityToGridModel(entity));

            }
            catch (ProDinnerException ex)
            {
                return Content(ex.Message);
            }
        }

        public ActionResult Delete(int id, string gridId)
        {
            return PartialView("ConfirmDelete", new DeleteConfirmInput
            {
                Id = id,
                Message = Mui.confirm_delete,
                GridId = gridId // gridId,id is needed to emphasize (make yellow) the row in question
            });
        }

        [HttpPost]
        public ActionResult Delete(DeleteConfirmInput input)
        {
            service.Delete(input.Id);
            OnCrud();
            return Json(new { input.Id });
        }

        /// <summary>
        /// used by views with AjaxList, grids do restore using api.update and call service.Restore in the GridGetItems method
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [HttpPost]
        [Authorize(Roles = "admin")]
        public ActionResult Restore(int id)
        {
            service.Restore(id);
            OnCrud();
            var item = service.Get(id);
            return Json(new { Id = id, Content = this.RenderPartialView(RowViewName, new[] { item }), Type = typeof(TEntity).Name.ToLower() });
        }

        /// <summary>
        /// used by the grid and by Create and Edit Actions to return a grid item model so the grid could use it to render a row
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        protected virtual object MapEntityToGridModel(TEntity entity)
        {
            return entity;
        }


        protected virtual void OnCrud()
        {
        }

        /// <summary>
        /// used by the AjaxList to render an item, also Create,Edit and Restore actions use it to render an item and return it to the ajaxlist so it would be updated
        /// </summary>
        protected virtual string RowViewName => string.Empty;
    }
}