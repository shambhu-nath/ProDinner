using System;
using System.Collections.Generic;
using System.Web.Mvc;

namespace Omu.ProDinner.WebUI.Utils
{
    public class AntiForgeryTokenFilter : IFilterProvider
    {
        public IEnumerable<Filter> GetFilters(ControllerContext conCtx, ActionDescriptor actionDescriptor)
        {
            var result = new List<Filter>();
            
            var ignoreAttr = actionDescriptor.GetCustomAttributes(typeof(IgnoreAntiforgeryTokenAttribute), true);

            if (ignoreAttr.Length != 0) return result;

            if (string.Equals(conCtx.HttpContext.Request.HttpMethod, "POST", StringComparison.OrdinalIgnoreCase))
            {
                result.Add(new Filter(new ValidateAntiForgeryTokenAttribute(), FilterScope.Global, null));
            }

            return result;
        }
    }
}