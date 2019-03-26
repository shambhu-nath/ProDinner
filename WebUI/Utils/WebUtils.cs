using System.Web;

namespace Omu.ProDinner.WebUI.Utils
{
    public static class WebUtils
    {
        public static bool IsUserAdmin()
        {
            return HttpContext.Current.User.IsInRole("admin");
        }
    }
}