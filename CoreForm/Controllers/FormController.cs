using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using LiteDB;
using Microsoft.AspNetCore.Mvc;

namespace CoreForm.Controllers
{
    [Route("Form")]
    public class FormController : Controller
    {

        public IActionResult GetModels()
        {
            using (var db = new LiteDatabase(@"coreform.db"))
            {
                // Get a collection (or create, if doesn't exist)
                var col = db.GetCollection<Data.FormModelVersionEntity>("formmodels");
                return Ok(col.FindAll());
            }
        }

        [Route("{Id}/Render")]
        public IActionResult Render(String Id)
        {
            return View("Render", new Models.FormViewModel() { FormId = Id });
        }

        [Route("{Id}/Build")]
        [HttpGet]
        public IActionResult Build(String Id)
        {
            return View("Builder", new Models.FormViewModel() { FormId = Id });
        }

        [Route("{Id}/Save")]
        [HttpPost]
        public IActionResult Save([FromBody] Object data, Guid Id)
        {

            var id = BusinessLogic.FormModel.SaveModelVersion(Id, "Title", data.ToString());
            return Ok(id);
        }
    }
}
