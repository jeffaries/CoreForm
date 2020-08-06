using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CoreForm.Data;
using CoreForm.DataInterfaces;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace CoreForm.ApiControllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class FormDefinitionController : ControllerBase
    {
        private IFormDefinitionProvider formDefinitionProvider;
        public FormDefinitionController(IFormDefinitionProvider formDefinitionProvider)
        {
            this.formDefinitionProvider = formDefinitionProvider;
        }


        // GET: api/<FormDefinitionController>
        [HttpGet]
        public IEnumerable<DataInterfaces.DataEntities.FormDefinition> Get()
        {
            return formDefinitionProvider.GetFormDefinitions();
        }

        // GET api/<FormDefinitionController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value of " + id;
        }

        // POST api/<FormDefinitionController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<FormDefinitionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<FormDefinitionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
