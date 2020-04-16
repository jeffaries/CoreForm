Vue.use(window.vuelidate.default)
var required = window.validators.required;
var minLength = window.validators.minLength;
var email = window.validators.email;


var registeredFields = new Map();

function RegisterField(fieldDefinition) {

    if (!fieldDefinition.fieldTemplate.computed) fieldDefinition.fieldTemplate.computed = {};
    if (!fieldDefinition.fieldTemplate.methods) fieldDefinition.fieldTemplate.methods = {};
    fieldDefinition.fieldTemplate.computed.$validation = function () {
        return this.schema.variable ? (app.$v.data[this.schema.variable] ? app.$v.data[this.schema.variable] : null) : null;
    }

    fieldDefinition.fieldTemplate.computed.$isrequired = function () {
        return (this.$validation ? this.$validation.$params.required : false);
    }

    fieldDefinition.fieldTemplate.computed.$error = function () {
        return (this.$validation ? this.$validation.$error : false);
    }

    fieldDefinition.fieldTemplate.computed.$errorMessage = function () {
        if (this.$validation && this.$validation.$error && this.schema.variable) {
            for (const valid in this.$validation) {
                if (!String(this.$validation[valid]).startsWith("$") && this.$validation[valid] === false) {
                    var valiName = this.$validation[valid];
                    alert(valid);
                    for (const varid in app.schema.variables) {
                        var variable = app.schema.variables[varid];
                        variable.validations[] = {
                            required
                        };
                    }
                    return msg;
                }
            }
        }
        return "";
    }


    fieldDefinition.fieldTemplate.methods.$touch = function () {
        (this.$validation ? this.$validation.$touch() : false);
    };

    registeredFields.set(fieldDefinition.type, fieldDefinition);
}




//traverse nodes and sub-nodes ans execute function for each node found
function tranverseDataNodes(node, func) {
    var subColl = null;
    if (typeof (node.columns) !== "undefined") subColl = node.columns;
    if (typeof (node.fields) !== "undefined") subColl = node.fields;
    func(node);
    if (subColl !== null) {
        for (var i = 0; i < subColl.length; i++) {
            tranverseDataNodes(subColl[i], func);
        }
    }
}

function findSchemaObjectById(id) {
    if (id === "formContainer") return app.schema;
    return findDataObjectByDataNode(app.schema, id)
}

function findDataObjectByDataNode(node, id) {
    var subColl = null;
    if (typeof (node.columns) !== "undefined") subColl = node.columns;
    if (typeof (node.fields) !== "undefined") subColl = node.fields;

    if (id === node.id) {
        return node;
    } else {
        if (subColl !== null) {
            for (var i = 0; i < subColl.length; i++) {
                var res = findDataObjectByDataNode(subColl[i], id);
                if (res !== null) return res;
            }
        }
    }
    return null;
}

function findDataCollectionByElement(element) {
    var id = null;
    if ($(element).attr("id")) id = $(element).attr("id");
    else if ($(element).data("ref")) id = $(element).data("ref");

    if (id === "formContainer") return app.schema.fields;
    return findDataCollectionInDataNode(app.schema, id)
}

function findDataCollectionInDataNode(node, id) {
    var subColl = null;
    if (typeof (node.columns) !== "undefined") subColl = node.columns;
    if (typeof (node.fields) !== "undefined") subColl = node.fields;

    if (subColl === null) return null;

    if (id === node.id) {
        return subColl;
    } else {
        for (var i = 0; i < subColl.length; i++) {
            var res = findDataCollectionInDataNode(subColl[i], id);
            if (res !== null) return res;
        }
    }
    return null;
}






