using System;
using System.Collections.Generic;
using System.Reflection;

using Omu.ProDinner.Core.Model;
using Omu.ProDinner.Core.Repository;
using Omu.ProDinner.Infra;
using Omu.ValueInjecter.Injections;

namespace Omu.ProDinner.WebUI.Mappers.Injections
{
    // go from int[] to ICollection<Entity> 
    public class IntsToEntities : LoopInjection
    {
        protected override bool MatchTypes(Type src, Type trg)
        {
            return src == typeof(int[]) 
                && trg.IsGenericType
                && trg.GetGenericTypeDefinition() == typeof(ICollection<>)
                && trg.GetGenericArguments()[0].IsSubclassOf(typeof(Entity));
        }

        protected override void SetValue(object source, object target, PropertyInfo sp, PropertyInfo trgProp)
        {
            var sourceVal = sp.GetValue(source);
            if (sourceVal != null)
            {
                // make EF load the collection before modifying it; without it we get errors when saving an existing object
                var trgVal = trgProp.GetValue(target);

                var entType = trgProp.PropertyType.GetGenericArguments()[0];

                dynamic uniRepo = IoC.Resolve<IUniRepo>();
                
                dynamic resList = Activator.CreateInstance(typeof(List<>).MakeGenericType(entType));

                var getMethod = uniRepo.GetType().GetMethod("Get").MakeGenericMethod(entType);

                var sourceAsArr = (int[])sourceVal;
                foreach (var id in sourceAsArr)
                {
                    resList.Add(getMethod.Invoke(uniRepo, new object[] {id}));
                }

                trgProp.SetValue(target, resList);
            }
        }
    }
}