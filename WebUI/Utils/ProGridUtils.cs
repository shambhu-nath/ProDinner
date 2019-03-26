using Omu.ProDinner.Resources;

namespace Omu.ProDinner.WebUI.Utils
{
    public static class ProGridUtils
    {
        public static string ChangePasswordFormat(string popupName)
        {
            return "<button type='button' class='awe-btn editbtn' onclick=\"awe.open('" + popupName + "', { params:{ id: .Id } })\">change password</button>";
        }

        public static string ChangePictureFormat(string popupName)
        {
            return "<button type='button' class='awe-btn editbtn' onclick=\"awe.open('" + popupName + "', { params:{ id: .Id } })\">" + Mui.change_picture + "</button>";
        }

        public static string Detailnst(string content)
        {
            return string.Format("<div class='detailnst'><i class='caretc'><i class='o-caret'></i></i> {0}</div>", content);
        }
    }
}