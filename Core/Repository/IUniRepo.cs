using System;
using System.Linq;
using Omu.ProDinner.Core.Model;

namespace Omu.ProDinner.Core.Repository
{
    public interface IUniRepo
    {
        T Add<T>(T o) where T : Entity, new();

        void Save();

        T Get<T>(int id) where T : Entity;

        IQueryable<T> GetAll<T>(bool showDeleted) where T : DelEntity;
        IQueryable<TEntity> GetAll<TEntity>() where TEntity : Entity;
    }
}