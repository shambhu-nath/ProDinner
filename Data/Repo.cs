using System.Data.Entity;
using System.Linq;
using Omu.ProDinner.Core;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ValueInjecter;

namespace Omu.ProDinner.Data
{
    public class Repo<T> : IRepo<T> where T : DelEntity
    {
        protected readonly DbContext dbContext;

        public Repo(IDbContextFactory dbCtxFact)
        {
            dbContext = dbCtxFact.GetContext();
        }

        public void Save()
        {
            dbContext.SaveChanges();
        }

        public T Add(T o)
        {
            var entity = dbContext.Set<T>().Create();
            entity.InjectFrom(o);
            dbContext.Set<T>().Add(entity);
            return entity;
        }
       
        public virtual void Delete(T o)
        {
            var del = o as IDel;
            if (del != null)
            {
                del.IsDeleted = true;
            }
            else
            {
                dbContext.Set<T>().Remove(o);
            }
        }

        public T Get(int id)
        {
            var entity = dbContext.Set<T>().Find(id);
            if (entity == null) throw new ProDinnerException("this entity doesn't exist anymore");
            return entity;
        }

        public void Restore(T o)
        {
            o.IsDeleted = false;
        }

        public virtual IQueryable<T> GetAll(bool showDeleted = false)
        {
            if (!showDeleted && typeof(IDel).IsAssignableFrom(typeof(T)))
            {
                return dbContext.Set<T>().Where(o => o.IsDeleted == false);
            }

            return dbContext.Set<T>();
        }
    }
}