using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.BusinessLogic
{
    public static class DataLayer
    {
        public static String GetConnectionString()
        {
            String folder = Startup.Configuration.GetValue<String>("data_location");

            return String.Format(@"Filename={0};Mode=Shared", System.IO.Path.Combine(folder, "coreform.db"));
        }
    }
}
