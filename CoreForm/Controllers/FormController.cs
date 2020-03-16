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
            var coll = BusinessLogic.FormModel.GetFormModels().Select(o => new { CreateDate = o.CreateDate, FormModelId = o.FormModelId, Id = o.Id, Name = o.Name });
            return Ok(coll);
        }

        [Route("{formVersionId}/Render")]
        public IActionResult Render(Guid formVersionId)
        {
            var form = BusinessLogic.FormModel.GetFormModelVersion(formVersionId);
            var model = new Models.FormViewModel() { FormId = form.Id, Name = form.Name };
            if (!String.IsNullOrEmpty(form.Content))
            {
                model.Model = JObject.Parse(form.Content);
            } else
                model.Model = new JObject();
            return View("Render", model);
        }

        [Route("NewModel")]
        [HttpPost]
        public IActionResult NewModel([FromBody] Object data)
        {
            var name = JObject.Parse(data.ToString()).GetValue("Name").ToString();
            var form = BusinessLogic.FormModel.CreateModel(name);
            return Ok(form.Id);
        }

        [Route("{formModelId}/Build")]
        [HttpGet]
        public IActionResult Build(Guid formModelId)
        {
            var form = BusinessLogic.FormModel.GetCurrentFormModelVersion(formModelId);
            var model = new Models.FormViewModel() { FormId = formModelId };
            if (form != null)
            {
                model.Name = form.Name;
                if (!String.IsNullOrEmpty(form.Content))
                    model.Model = JObject.Parse(form.Content);
                else
                    model.Model = new JObject();
            }else
            {
                model.Name = "New model";
                model.Model = new JObject();
            }
            return View("Builder", model);
        }

        [Route("{formModelId}/Save")]
        [HttpPost]
        public IActionResult Save([FromBody] Object data, Guid formModelId)
        {
            var model = BusinessLogic.FormModel.UpdateModel(formModelId, "Title", data.ToString());
            return Ok(model.Id);
        }
    }
}
