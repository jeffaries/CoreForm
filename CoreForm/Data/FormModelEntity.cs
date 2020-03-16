using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.Data
{
    
    public class FormModelEntity
    {
        public FormModelEntity()
        {
            Versions = new List<FormModelVersionEntity>();
        }

        public Guid Id { get; set; }

        [BsonRef("formmodelversions")]
        public FormModelVersionEntity CurrentVersion { get; set; }

        [BsonRef("formmodelversions")]
        public List<FormModelVersionEntity> Versions { get; set; }
    }
}
