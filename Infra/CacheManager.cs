using System;
using System.Collections.Concurrent;
using System.Collections.Generic;

namespace Omu.ProDinner.Infra
{
    public class CacheManager : ICacheManager
    {
        private readonly ICacheStorage repo;

        private static readonly ConcurrentDictionary<string, Tuple<object, HashSet<string>>> groups
            = new ConcurrentDictionary<string, Tuple<object, HashSet<string>>>();

        public CacheManager(ICacheStorage repo)
        {
            this.repo = repo;
        }

        public void RemoveGroup(string group)
        {
            Tuple<object, HashSet<string>> tuple;

            if (groups.ContainsKey(group) && groups.TryGetValue(group, out tuple))
            {
                lock (tuple.Item1)
                {
                    foreach (var key in tuple.Item2)
                    {
                        repo.Remove(key);
                    }
                }
            }
        }

        public void Remove(string key)
        {
            repo.Remove(key);
        }

        public T Get<T>(string key, Func<T> getFunc, string group = null)
        {
            var val = repo.Get(key);

            if (val != null)
            {
                return (T)val;
            }

            if (group != null)
            {
                groups.AddOrUpdate(
                    group,
                    g => new Tuple<object, HashSet<string>>(new object(), new HashSet<string> {key}),
                    (gname, tuple) =>
                    {
                        lock (tuple.Item1)
                        {
                            tuple.Item2.Add(key);
                        }

                        return tuple;
                    });
            }

            val = getFunc();

            repo.Insert(key, val);

            return (T)val;
        }
    }
}