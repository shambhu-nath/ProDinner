using Omu.ProDinner.Core;

namespace Omu.ProDinner.WebUI.Utils
{
    public static class Check
    {
        public static void NotNull(object o, string name)
        {
            if (o == null)
            {
                throw new ProArgumentNullException(name);
            }
        }
    }
}