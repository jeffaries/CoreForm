using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.Models
{
    public class FormViewModel
    {
        public Guid FormId { get; set; }
        public string Name { get; set; }

        public JObject Model { get; set; }
    }
}
