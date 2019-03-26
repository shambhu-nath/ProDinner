using System.Globalization;
using Omu.ProDinner.Resources;
using Omu.ProDinner.WebUI.ViewModels.Display;

namespace Omu.ProDinner.WebUI.Utils
{
    public static class ClientSideUtils
    {
        public static ClientDict GetClientDict()
        {
            return new ClientDict
                {
                    GridInfo = Mui.gridInfo,
                    Select = Mui.please_select,
                    SearchForRes = "search for more results",
                    Searchp = "search ...",
                    Months = DateTimeFormatInfo.CurrentInfo.MonthNames,
                    Days = DateTimeFormatInfo.CurrentInfo.ShortestDayNames
            };
        }
    }
}