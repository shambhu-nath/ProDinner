using System.Web;
using System.Web.Mvc;
using Omu.AwesomeMvc;
using Omu.ProDinner.Resources;

namespace Omu.ProDinner.WebUI.Helpers.Awesome
{
    /// <summary>
    /// modified version of CrudHelpers extenions copied from AwesomeMvcDemo
    /// </summary>
    public static class ProCrudHelpers
    {
        private static UrlHelper GetUrlHelper<T>(HtmlHelper<T> html)
        {
            return new UrlHelper(html.ViewContext.RequestContext);
        }

        public static IHtmlString InitCrudPopupsForGrid<T>(this HtmlHelper<T> html, string gridId, string crudController, int createPopupHeight = 430, bool fullScreen = false)
        {
            var url = GetUrlHelper(html);

            gridId = html.Awe().GetContextPrefix() + gridId;

            var result =
            html.Awe()
                .InitPopupForm()
                .Name("create" + gridId)
                .Group(gridId)
                .Height(createPopupHeight)
                .Fullscreen(fullScreen)
                .Url(url.Action("Create", crudController))
                .Success("utils.itemCreated('" + gridId + "')")
                .Modal()
                .ToString()

            + html.Awe()
                  .InitPopupForm()
                  .Name("edit" + gridId)
                  .Group(gridId)
                  .Height(createPopupHeight)
                  .Fullscreen(fullScreen)
                  .Url(url.Action("Edit", crudController))
                  .Modal()
                  .Success("utils.itemEdited('" + gridId + "')")

            + html.Awe()
                  .InitPopupForm()
                  .Name("delete" + gridId)
                  .Group(gridId)
                  .Url(url.Action("Delete", crudController))
                  .Success("utils.itemDeleted('" + gridId + "')")
                  .OnLoad("utils.delConfirmLoad('" + gridId + "')")
                  .Parameter("gridId", gridId) // used to call grid.api.select and emphasize the row
                  .Height(200)
                  .Modal();

            return new MvcHtmlString(result);
        }
        
        public static IHtmlString InitCrudPopupsForAjaxList<T>(
            this HtmlHelper<T> html, 
            string ajaxListId, 
            string controller,
            string popupName,
            string afterUpdateFunc = null,
            bool fullScreen = false,
            int createPopupHeight = 430,
            int createPopupWidth = 630)
        {

            var editSuccessFunc = afterUpdateFunc == null
                          ? string.Format("utils.itemEditedAl('{0}')", ajaxListId)
                          : string.Format("utils.itemEditedAl('{0}', {1})", ajaxListId, afterUpdateFunc);

            var url = GetUrlHelper(html);

            var result =
                html.Awe()
                    .InitPopupForm()
                    .Name("create" + popupName)
                    .Url(url.Action("Create", controller))
                    .Parameter("usingAjaxList", true)
                    .Height(createPopupHeight)
                    .Fullscreen(fullScreen)
                    .Success("utils.itemCreatedAl('" + ajaxListId + "')")
                    .Group(ajaxListId)
                    .Title(Mui.Create)
                    .Width(createPopupWidth)
                    .Modal()
                    .ToString()

                + html.Awe()
                      .InitPopupForm()
                      .Name("edit" + popupName)
                      .Url(url.Action("Edit", controller))
                      .Parameter("usingAjaxList", true)
                      .Height(createPopupHeight)
                      .Fullscreen(fullScreen)
                      .Success(editSuccessFunc)
                      .Group(ajaxListId)
                      .Title(Mui.Edit)
                      .Width(createPopupWidth)
                      .Modal()

                + html.Awe()
                      .InitPopupForm()
                      .Name("delete" + popupName)
                      .Url(url.Action("Delete", controller))
                      .Success("utils.itemDeletedAl('" + ajaxListId + "')")
                      .Group(ajaxListId)
                      .OkText(Mui.Yes)
                      .CancelText(Mui.No)
                      .Height(200)
                      .Modal()
                      .Title(Mui.Delete)

                + html.Awe()
                      .InitCall("restore" + popupName)
                      .Url(url.Action("Restore", controller))
                      .Success(editSuccessFunc);

            return new MvcHtmlString(result);
        }

        public static IHtmlString InitDeletePopupForGrid<T>(this HtmlHelper<T> html, string gridId, string crudController, string action = "Delete")
        {
            var url = GetUrlHelper(html);
            gridId = html.Awe().GetContextPrefix() + gridId;

            var result =
                html.Awe()
                  .InitPopupForm()
                  .Name("delete" + gridId)
                  .Group(gridId)
                  .Url(url.Action(action, crudController))
                  .Success("utils.itemDeleted('" + gridId + "')")
                  .OnLoad("utils.delConfirmLoad('" + gridId + "')") // calls grid.api.select and animates the row
                  .Height(200)
                  .Modal()
                  .Title(Mui.Delete)
                  .ToString();

            return new MvcHtmlString(result);
        }
    }
}