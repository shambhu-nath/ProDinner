using System;

namespace Omu.ProDinner.Infra
{
    public interface ICacheManager
    {
        void RemoveGroup(string group);
        void Remove(string key);
        T Get<T>(string key, Func<T> getFunc, string group = null);
    }
}