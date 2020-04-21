using CoreForm.Data;
using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.BusinessLogic
{
    public static class FormSubmission
    {
        public static void SaveSubmission(Guid SubmissionId, SubmissionStatusEnum Status, String User, String submissionData)
        {
            using (var db = new LiteDatabase(DataLayer.GetConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var submissions = db.GetCollection<Data.FormSubmission>("formsubmissions").Include(x => x.Versions);
                var submission = submissions.FindById(SubmissionId);
                if (submission != null)
                {
                    if (submission.Status != SubmissionStatusEnum.Submitted)
                    {
                        var version = new FormSubmissionVersion()
                        {
                            Id = Guid.NewGuid(),
                            Date = DateTime.Now,
                            SubmissionId = SubmissionId,
                            Content = submissionData,
                            User = User
                        };
                        submission.Versions.Add(version);
                        submissions.Update(submission);
                    }
                    else
                        throw new Exception("This submission is closed");
                }
                else throw new Exception("This submission doesn't exist");
            }
        }
    }
}
