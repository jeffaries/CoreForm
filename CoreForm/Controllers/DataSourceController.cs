using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CoreForm.Controllers
{
    public class DataSourceController : Controller
    {
        public IActionResult Get(String Id)
        {
            List<ListControlItem> list = new List<ListControlItem>();
            list.Add(new ListControlItem() { Label = "Label1", Value = "1" });
            list.Add(new ListControlItem() { Label = "Label2", Value = "2" });
            list.Add(new ListControlItem() { Label = "Label3", Value = "3" });

            return Ok(Newtonsoft.Json.JsonConvert.SerializeObject(list));
        }
    }
}