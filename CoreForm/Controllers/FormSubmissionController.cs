using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CoreForm.Controllers
{
    [Route("FormSubmission")]
    public class FormSubmissionController : Controller
    {
        [Route("{Id}")]
        [HttpGet]
        public IActionResult Definition(String Id)
        {
            return Content(Properties.Resources.formData, "application/json");
        }
        [Route("{Id}")]
        [HttpPost]
        public IActionResult Submission([FromBody] Object data, Guid Id)
        {
            JObject d = JObject.Parse(data.ToString());
            BusinessLogic.FormSubmission.SaveSubmission(Id, Data.SubmissionStatusEnum.Submitted, "Bob", data.ToString());
            return Ok("ça marche lààààà!") ;
        }

    }
}