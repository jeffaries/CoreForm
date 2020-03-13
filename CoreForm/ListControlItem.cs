using System;
using System.Collections.Generic;
using System.Linq;
using Newtonsoft.Json;
using System.Threading.Tasks;

namespace CoreForm
{
    public class ListControlItem
    {
        [JsonProperty("value")]
        public String Value { get; set; }
        [JsonProperty("label")]
        public String Label { get; set; }
    }
}
