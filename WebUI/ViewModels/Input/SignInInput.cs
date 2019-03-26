using System.ComponentModel.DataAnnotations;

using Omu.ProDinner.Resources;

namespace Omu.ProDinner.WebUI.ViewModels.Input
{
    public class SignInInput
    {
        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        public string Login { get; set; }

        [Required(ErrorMessageResourceName = "required", ErrorMessageResourceType = typeof(Mui))]
        [UIHint("Password")]
        public string Password { get; set; }

        public bool Remember { get; set; }
    }
}