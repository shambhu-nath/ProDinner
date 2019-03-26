using System;
using System.Collections.Concurrent;
using System.Web;
using Omu.ProDinner.Infra;

namespace Omu.ProDinner.WebUI.Utils
{
    public class CacheStorage : ICacheStorage
    {
        public void Insert(string key, object value)
        {
            HttpContext.Current.Cache.Insert(key, value);
        }

        public void Remove(string key)
        {
            HttpContext.Current.Cache.Remove(key);
        }

        public object Get(string key)
        {
            return HttpContext.Current.Cache.Get(key);
        }
    }
}