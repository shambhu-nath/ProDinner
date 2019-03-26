using System.ComponentModel.DataAnnotations;

using Omu.ProDinner.Resources;

namespace Omu.ProDinner.WebUI.ViewModels.Input
{
    public class UserEditInput : Input
    {
        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [UIHint("MultiLookupDropdown")]
        public int[] Roles { get; set; }
    }
}