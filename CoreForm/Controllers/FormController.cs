using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json.Linq;

namespace CoreForm.Controllers
{
    [Route("Form")]
    public class FormController : Controller
    {

        public IActionResult GetModels()
        {
            var coll = BusinessLogic.FormModel.GetFormModels().Select(o => new { CreateDate = o.CurrentVersion.CreateDate, Id = o.Id, Name = o.CurrentVersion.Name });
            return Ok(coll);
        }

        [Route("{formVersionId}/Render")]
        public IActionResult Render(Guid formVersionId)
        {
            var form = BusinessLogic.FormModel.GetFormModelVersion(formVersionId);
            return View("Render", form);
        }

        [Route("NewModel")]
        [HttpPost]
        public IActionResult NewModel([FromBody] Object data)
        {
            var form = BusinessLogic.FormModel.CreateModel(data.ToString());
            return Ok(form.Id);
        }

        [Route("{formModelId}/Build")]
        [HttpGet]
        public IActionResult Build(Guid formModelId)
        {
            var form = BusinessLogic.FormModel.GetCurrentFormModelVersion(formModelId);
            return View("Builder", form);
        }


        [Route("{formModelId}/Schema")]
        [HttpGet]
        public IActionResult GetSchema(Guid formModelId)
        {
            var form = BusinessLogic.FormModel.GetCurrentFormModelVersion(formModelId);
            return Ok(form.Content);
        }

        [Route("{formModelId}/Save")]
        [HttpPost]
        public IActionResult Save([FromBody] Object data, Guid formModelId)
        {
            var model = BusinessLogic.FormModel.UpdateModel(formModelId, data.ToString());
            return Ok(model.Id);
        }
    }
}
