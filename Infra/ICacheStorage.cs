namespace Omu.ProDinner.Infra
{
    public interface ICacheStorage
    {
        void Insert(string key, object value);
        void Remove(string key);
        object Get(string key);
    }
}