using System;
using System.Linq;
using System.Linq.Expressions;
using Omu.ProDinner.Core.Model;

namespace Omu.ProDinner.Core.Service
{
    public interface ICrudService<T> where T: DelEntity, new()
    {
        int Create(T item);

        void Save();

        void Delete(int id);

        T Get(int id);

        IQueryable<T> GetAll(bool showDeleted = false);

        void Restore(int id);

        void BatchDelete(int[] ids);

        void BatchRestore(int[] ids);
    }
}