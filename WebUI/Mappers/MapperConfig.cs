using System;
using Omu.ProDinner.Core.Model;
using Omu.ProDinner.WebUI.Mappers.Injections;
using Omu.ProDinner.WebUI.ViewModels.Input;
using Omu.ValueInjecter;

namespace Omu.ProDinner.WebUI.Mappers
{
    public class MapperConfig
    {
        public static MapperInstance CrudMapper = new MapperInstance();

        public static void Configure()
        {
            // tag is being used here to pass in the existing Entity ( pulled from the Db )
            CrudMapper.DefaultMap = (src, resType, tag) =>
                {
                    var res = tag != null && tag.GetType().IsSubclassOf(typeof(Entity)) ? tag : Activator.CreateInstance(resType);

                    // handle basic properties
                    res.InjectFrom(src);
                    var srcType = src.GetType();    
                    
                    // handle the rest Country.Id <-> CountryId; int <-> int?
                    if (srcType.IsSubclassOf(typeof(Entity)) && resType.IsSubclassOf(typeof(Input)))
                    {
                        res.InjectFrom<NormalToNullables>(src)
                           .InjectFrom<EntitiesToInts>(src);
                    }
                    else if (srcType.IsSubclassOf(typeof(Input)) && resType.IsSubclassOf(typeof(Entity)))
                    {
                        res.InjectFrom(new IntsToEntities(), src);
                        res.InjectFrom<IntsToEntities>(src)
                           .InjectFrom<NullablesToNormal>(src);
                    }

                    return res;
                };

            CrudMapper.AddMap<Dinner, DinnerInput>((dinner, tag) =>
                {
                    var res = CrudMapper.MapDefault<DinnerInput>(dinner, tag);

                    res.Time = dinner.Start;
                    res.Duration = (int)dinner.End.Subtract(dinner.Start).TotalMinutes;
                    return res;
                });

            CrudMapper.AddMap<DinnerInput, Dinner>((input, tag) =>
                {
                    var res = CrudMapper.MapDefault<Dinner>(input, tag);

                    res.Start = res.Start.Date + input.Time.Value.TimeOfDay;
                    res.End = res.Start.AddMinutes(input.Duration);
                    return res;
                });
        }
    }
}