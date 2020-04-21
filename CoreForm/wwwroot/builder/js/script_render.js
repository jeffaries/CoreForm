var app;



$(document).ready(function () {


    app = new Vue({
        el: '#app',
        data: function () {
            return {
                data: {},
                schema: {}
            }
        },
        validations: function () {
            var obj = { data: {} };

            for (const varid in this.schema.variables) {
                var variable = this.schema.variables[varid];
                obj.data[variable.name] = {};
                var rv = obj.data[variable.name];
                var i = 0;
                for (const valid in variable.validations) {
                    var v = variable.validations[valid];
                    rv["v" + i] = formValidators[v.type].build(v);
                    i++;
                }

            };
            return obj;
        },
        methods: {
            submit: function () {
                this.$v.$touch();
            },
            saveData: function () {
                //var url = "/Form/NewModel";
                //var urlParams = new URLSearchParams(window.location.search);
                //var schemaId = urlParams.get('schemaid');
                //if (schemaId !== undefined && schemaId !== "") {
                //    url = "/Form/" + schemaId + "/save";
                //}

                //$.ajax({
                //    url: url,
                //    type: "POST",
                //    data: JSON.stringify(this.schema),
                //    contentType: "application/json; charset=utf-8",
                //    dataType: "json",
                //    success: function (data) {
                //        alert("Data Loaded: " + data);
                //    }
                //});



            }
        },
        created: function () {
            // `this` est une référence à l'instance de vm

            for (let [key, value] of registeredFields.entries()) {
                this.$options.components[key] = value.fieldTemplate;
            }
            for (let [key, value] of Object.entries(this.$options.components)) {
                value.components = this.$options.components;
            }

            var urlParams = new URLSearchParams(window.location.search);
            var schemaId = urlParams.get('schemaid');
            if (schemaId !== null && typeof (schemaId) !== 'undefined' && schemaId !== "") {
                $.ajax({
                    url: "/Form/" + schemaId + "/schema",
                    //url: "/builder/test.json?" + Date.now(),
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        app.schema = data;
                    }
                });
            }


        }

    });

});

