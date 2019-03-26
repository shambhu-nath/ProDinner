using System;
using System.Reflection;

using Omu.ValueInjecter.Injections;

namespace Omu.ProDinner.WebUI.Mappers.Injections
{
    public class NormalToNullables : LoopInjection
    {
        protected override bool MatchTypes(Type source, Type target)
        {
            return source == Nullable.GetUnderlyingType(target);
        }

        protected override void SetValue(object source, object target, PropertyInfo sp, PropertyInfo tp)
        {
            var val = sp.GetValue(source);

            //ignore int = 0 and DateTime = 1/01/0001
            if (sp.PropertyType == typeof(int) && (int)val == default(int) ||
                sp.PropertyType == typeof(DateTime) && (DateTime)val == default(DateTime))
            {
                return;
            }

            tp.SetValue(target, val);
        }
    }
}