using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CoreForm.Controllers
{
    [Route("FormData")]
    public class FormDataController : Controller
    {
        [Route("{Id}")]
        [HttpGet]
        public IActionResult Definition(String Id)
        {
            return Content(Properties.Resources.formData, "application/json");
        }
        [Route("submission")]
        [HttpPost]
        public IActionResult Submission([FromBody] Object data)
        {
            JObject d = JObject.Parse(data.ToString());
            
            Dictionary<String,JToken> values = d.SelectToken("$.data").ToObject<Dictionary<String, JToken>>();

            int? select = values["select"].Value<int>();


            var files = values["upload"].Values<JToken>();
            var node = files.First();
            String base64 = node["url"].Value<String>().Split(',').LastOrDefault();
            
            byte[] tempBytes = Convert.FromBase64String(base64);
            System.IO.File.WriteAllBytes(@"C:\temp\" + node["originalName"].Value<String>(), tempBytes);

            return StatusCode(200, "ça marche lààààà!") ;
        }

    }
}