using CoreForm.DataInterfaces;
using CoreForm.DataInterfaces.DataEntities;
using System;
using System.Collections.Generic;

namespace CoreForm.Data.LiteDB
{
    public class FormDefinitionProvider : IFormDefinitionProvider
    {
        private List<FormDefinition> list;

        public FormDefinitionProvider()
        {
            list = new List<FormDefinition>() { new FormDefinition() { ID = Guid.NewGuid(), Title = "Hello" } };
        }

        public IEnumerable<FormDefinition> GetFormDefinitions()
        {
            return list;
        }
    }
}
