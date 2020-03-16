using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.Data
{
    public class FormSubmission
    {
        public FormSubmission()
        {
            Versions = new List<FormSubmissionVersion>();
        }

        public Guid Id { get; set; }
        public Guid FormVersionId { get; set; }
        public SubmissionStatusEnum Status { get; set; } = SubmissionStatusEnum.Pending;

        public FormSubmissionVersion Current { get; set; }

        public List<FormSubmissionVersion> Versions { get; set; }
    }

    public enum SubmissionStatusEnum
    {
        Pending=0, Draft=1, Submitted=2
    }
}
