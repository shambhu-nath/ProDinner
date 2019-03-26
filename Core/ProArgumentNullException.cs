using System;

namespace Omu.ProDinner.Core
{
    public class ProArgumentNullException : ArgumentNullException
    {
        public ProArgumentNullException(string paramName) : base(paramName)
        {
        }
    }
}