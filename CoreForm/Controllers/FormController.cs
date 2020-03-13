using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

namespace CoreForm.Controllers
{
    public class FormController : Controller
    {
        public IActionResult Render(String Id)
        {
            return View("Render", new Models.FormViewModel() { FormId =  Id});
        }
    }
}