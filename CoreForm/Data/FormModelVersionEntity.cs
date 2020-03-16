using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.Data
{
    public class FormModelVersionEntity
    {
        public Guid Id { get; set; }
        public String Name { get; set; }
        public Guid FormModelId { get; set; }
        public DateTime CreateDate { get; set; }
        public String Content { get; set; }
    }
}
