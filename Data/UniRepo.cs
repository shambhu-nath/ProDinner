using System.Data.Entity;
using System.Linq;
using Omu.ProDinner.Core;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ValueInjecter;
using System;

namespace Omu.ProDinner.Data
{
    public class UniRepo : IUniRepo
    {
        private readonly DbContext dbctx;

        public UniRepo(IDbContextFactory ctxFactory)
        {
            dbctx = ctxFactory.GetContext();
        }

        public TEntity Add<TEntity>(TEntity o) where TEntity : Entity, new()
        {
            var entity = new TEntity();
            entity.InjectFrom(o);
            dbctx.Set<TEntity>().Add(entity);
            return entity;
        }

        public void Save()
        {
            dbctx.SaveChanges();
        }

        public T Get<T>(int id) where T : Entity
        {
            var entity = dbctx.Set<T>().Find(id);

            if (entity == null) throw new ProDinnerException("this entity doesn't exist anymore");
            return entity;
        }

        public IQueryable<TEntity> GetAll<TEntity>(bool showDeleted) where TEntity : DelEntity
        {
            if (showDeleted)
            {
                return dbctx.Set<TEntity>();
            }

            return dbctx.Set<TEntity>().Where(o => !o.IsDeleted);
        }

        public IQueryable<TEntity> GetAll<TEntity>() where TEntity : Entity
        {
            return dbctx.Set<TEntity>();
        }
    }
}