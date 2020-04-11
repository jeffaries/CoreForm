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
        private static String getConnectionString()
        {
            return @"Filename=coreform.db;Connection=shared";
        }

        public static List<FormModelVersionEntity> GetFormModels()
        {
            using (var db = new LiteDatabase(getConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                var l = forms.Include(x => x.CurrentVersion).FindAll();
                var l2 = l.Select(o => o.CurrentVersion).ToList();
                return l2;
            }
        }

        public static FormModelVersionEntity GetFormModelVersion(Guid formModelVersionId)
        {
            using (var db = new LiteDatabase(getConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var versions = db.GetCollection<Data.FormModelVersionEntity>("formmodelversions");
                return versions.FindById(formModelVersionId);
            }
        }

        public static FormModelVersionEntity GetCurrentFormModelVersion(Guid formModelId)
        {
            using (var db = new LiteDatabase(getConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                return forms.Include(x=>x.CurrentVersion).FindById(formModelId)?.CurrentVersion;
            }
        }

        public static FormModelEntity CreateModel(String Name)
        {
            return CreateModel(Name, "{}");
        }

        public static FormModelEntity CreateModel(String Name, String Model)
        {
            return UpdateModel(Guid.NewGuid(), Name, Model);
        }

        public static FormModelEntity UpdateModel(Guid ModelId, String Name, String Model)
        {
            Data.FormModelEntity form;
            using (var db = new LiteDatabase(getConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                var versions = db.GetCollection<Data.FormModelVersionEntity>("formmodelversions");
                form = forms.FindById(ModelId);
                if (form is null)
                {
                    form = new Data.FormModelEntity()
                    {
                        Id = ModelId,
                    };
                    forms.Insert(form);
                }
                var version = new Data.FormModelVersionEntity()
                {
                    Id = Guid.NewGuid(),
                    Name = Name,
                    CreateDate = DateTime.Now,
                    Content = Model,
                    FormModelId = ModelId
                };
                versions.Insert(version);
                form.CurrentVersion = version;
                form.Versions.Add(version);
                forms.Update(form);
            }
            return form;
        }
    }
}
