using CoreForm.Data;
using LiteDB;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.BusinessLogic
{
    public static class FormModel
    {
        public static List<FormModelVersionEntity> GetFormModels()
        {
            using (var db = new LiteDatabase(@"coreform.db"))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                var l = forms.Include(x => x.CurrentVersion).FindAll();
                var l2 =l.Select(o=>o.CurrentVersion).ToList();
                return l2;
            }
        }

        public static FormModelVersionEntity GetCurrentFormModelVersion(Guid formModelId)
        {
            using (var db = new LiteDatabase(@"coreform.db"))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                return forms.FindById(formModelId)?.CurrentVersion;
            }
        }

        public static Guid SaveModelVersion(String Name, String Model)
        {
            return SaveModelVersion(Guid.NewGuid(), Name, Model);
        }

        public static Guid SaveModelVersion(Guid Id, String Name, String Model)
        {
            using (var db = new LiteDatabase(@"coreform.db"))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                var versions = db.GetCollection<Data.FormModelVersionEntity>("formmodelversions");
                Data.FormModelEntity form = forms.FindById(Id);
                if (form is null)
                {
                    form = new Data.FormModelEntity()
                    {
                        Id = Id,
                    };
                    forms.Insert(form);
                }
                var version = new Data.FormModelVersionEntity()
                {
                    Id = Guid.NewGuid(),
                    Name = Name,
                    CreateDate = DateTime.Now,
                    Content = Model,
                    FormModelId = Id
                };
                versions.Insert(version);
                form.CurrentVersion = version;
                form.Versions.Add(version);
                forms.Update(form);
                return version.Id;
            }
        }
    }
}
