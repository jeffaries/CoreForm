using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CoreForm.Controllers
{
    public class FormDataController : Controller
    {
        [HttpGet]
        public IActionResult Definition(String Id)
        {
            return Content(Properties.Resources.formData, "application/json");
        }
        [HttpPost]
        public IActionResult Submission([FromBody] Object data)
        {
            dynamic d = Newtonsoft.Json.JsonConvert.DeserializeObject(data.ToString());
            return StatusCode(400, "ça marche pas lààààà!") ;
        }

    }
}