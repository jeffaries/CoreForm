using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.Data
{
    public class FormSubmissionVersion
    {
        public Guid Id { get; set; }
        public Guid SubmissionId { get; set; }
        public DateTime Date { get; set; }
        public String User { get; set; }
        public String Content { get; set; }

        public Guid FormModelVersionId { get; set; }

    }
}
