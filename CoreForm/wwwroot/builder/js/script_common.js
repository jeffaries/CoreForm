Vue.use(window.vuelidate.default)
var registeredFields = new Map();


var required = window.validators.required;
var minLength = window.validators.minLength;

var formValidators = {
    "required": {
        build: function (data) {
            return window.validators.required;
        }
    },
    "minLength": {
        build: function (data) {
            return window.validators.minLength(data.minLength);
        }
    },
    "email": {
        build: function (data) {
            return window.validators.email;
        }
    }
}

function RegisterField(fieldDefinition) {

    if (!fieldDefinition.fieldTemplate.computed) fieldDefinition.fieldTemplate.computed = {};
    if (!fieldDefinition.editForm.computed) fieldDefinition.editForm.computed = {};
    if (!fieldDefinition.fieldTemplate.methods) fieldDefinition.fieldTemplate.methods = {};
    fieldDefinition.fieldTemplate.computed.$validation = function () {
        return this.schema.variable ? (this.$root.$v.data[this.schema.variable] ? this.$root.$v.data[this.schema.variable] : null) : null;
    }

    fieldDefinition.fieldTemplate.computed.$isrequired = function () {
        if (this.$validation) {
            for (const param in this.$validation.$params) {
                if (this.$validation.$params[param].type === "required") return true;
            }
        }
    }



    fieldDefinition.fieldTemplate.computed.$error = function () {
        return (this.$validation ? this.$validation.$error : false);
    }

    fieldDefinition.fieldTemplate.computed.$errorMessage = function () {
        if (this.$validation && this.$validation.$error && this.schema.variable) {
            for (const valid in this.$validation) {
                if (!String(this.$validation[valid]).startsWith("$") && this.$validation[valid] === false) {
                    for (const varid in this.$root.schema.variables) {
                        var variable = this.$root.schema.variables[varid];
                        if (variable.name === this.schema.variable) {
                            for (const vali in variable.validations) {
                                var validation = variable.validations[vali];
                                if (validation.type === this.$validation.$params[valid].type) {
                                    return validation.errorMessage;
                                }
                            }
                        }
                    }

                }
            }
        }
        return "";
    }

    fieldDefinition.fieldTemplate.methods.$touch = function () {
        (this.$validation ? this.$validation.$touch() : false);
    };

    fieldDefinition.editForm.computed.$validation = function () {
        return this.$root.$v.editformdata;
    }


    registeredFields.set(fieldDefinition.type, fieldDefinition);
}


