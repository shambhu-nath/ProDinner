using System;
using System.ComponentModel.DataAnnotations;
using System.Web.Mvc;

using Omu.AwesomeMvc;
using Omu.ProDinner.Resources;
using Omu.ProDinner.WebUI.ViewModels.Attributes;

namespace Omu.ProDinner.WebUI.ViewModels.Input
{
    public class DinnerInput : Input
    {
        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [StrLen(50)]
        [Display(ResourceType = typeof(Mui), Name = "Name")]
        public string Name { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [UIHint("LookupCountry")]
        [Display(ResourceType = typeof(Mui), Name = "Country")]
        public int? CountryId { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [UIHint("Odropdown")]
        [AweUrl(Controller = "Data", Action = "GetChefs")]
        [Display(ResourceType = typeof(Mui), Name = "Chef")]
        public int? ChefId { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [StrLen(20)]
        [Display(ResourceType = typeof(Mui), Name = "Address")]
        public string Address { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [DataType(DataType.DateTime)]
        [Display(ResourceType = typeof(Mui), Name = "Date")]
        public DateTime? Start { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [CollectionMaxLen(10)]
        [UIHint("MultiLookupFulls")]
        [AdditionalMetadata("DragAndDrop",true)]
        [AdditionalMetadata("PopupClass","mealsLookup")]
        [AdditionalMetadata("ParameterFunc", "getMealsLookupPageSize")]
        [MultiLookup(Fullscreen = true)]
        [Display(ResourceType = typeof(Mui), Name = "Meals")]
        public int[] Meals { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [UIHint("TimePickerm")]
        [Display(ResourceType = typeof(Mui), Name = "Time")]
        public DateTime? Time { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [Range(10, 120, ErrorMessageResourceName = "range", ErrorMessageResourceType = typeof(Mui))]
        [UIHint("Duration")]
        [Display(ResourceType = typeof(Mui), Name = "Duration")]
        [AdditionalMetadata("Step", 5)]
        [AdditionalMetadata("Min", 10)]
        [AdditionalMetadata("Max", 120)]
        public int Duration { get; set; }
    }
}