using CoreForm.Data;
using LiteDB;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CoreForm.BusinessLogic
{
    public static class FormModel
    {

        public static IEnumerable<FormModelEntity> GetFormModels()
        {
            using (var db = new LiteDatabase(DataLayer.GetConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                var l = forms.Include(x => x.CurrentVersion).FindAll();
                return l.ToList();
            }
        }

        public static FormModelVersionEntity GetFormModelVersion(Guid formModelVersionId)
        {
            using (var db = new LiteDatabase(DataLayer.GetConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var versions = db.GetCollection<Data.FormModelVersionEntity>("formmodelversions");
                return versions.FindById(formModelVersionId);
            }
        }

        public static FormModelVersionEntity GetCurrentFormModelVersion(Guid formModelId)
        {
            using (var db = new LiteDatabase(DataLayer.GetConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels");
                return forms.Include(x=>x.CurrentVersion).FindById(formModelId)?.CurrentVersion;
            }
        }


        public static FormModelEntity CreateModel(String Model)
        {
            return UpdateModel(Guid.NewGuid(), Model);
        }

        public static FormModelEntity UpdateModel(Guid ModelId, String Model)
        {
            JObject jModel = JObject.Parse(Model);
            String Name = jModel.Value<String>("name");
            Data.FormModelEntity form;
            using (var db = new LiteDatabase(DataLayer.GetConnectionString()))
            {
                // Get a collection (or create, if doesn't exist)
                var forms = db.GetCollection<Data.FormModelEntity>("formmodels").Include(o=>o.Versions).Include(o=>o.CurrentVersion);
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
                int versionNum = 1;
                if (form.CurrentVersion != null)
                {
                    versionNum = form.CurrentVersion.Version +1;
                }
                jModel["formVersion"] = versionNum;
                var version = new Data.FormModelVersionEntity()
                {
                    Id = Guid.NewGuid(),
                    Name = Name,
                    CreateDate = DateTime.Now,
                    Content = jModel.ToString(),
                    FormModelId = ModelId,
                    Version = versionNum
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
