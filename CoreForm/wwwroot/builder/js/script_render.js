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
        methods: {
           
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

