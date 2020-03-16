using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.BusinessLogic
{
    public static class FormDataSource
    {
        private static String getConnectionString()
        {
            return @"Filename=coreform.db";
        }

    }
}
