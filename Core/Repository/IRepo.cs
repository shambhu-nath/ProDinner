using System.Linq;
using Omu.ProDinner.Core.Model;

namespace Omu.ProDinner.Core.Repository
{
    public interface IRepo<T> where T : DelEntity
    {
        void Save();
        T Add(T o);
        void Delete(T o);
        T Get(int id);
        void Restore(T o);
        IQueryable<T> GetAll(bool showDeleted = false);
    }
}