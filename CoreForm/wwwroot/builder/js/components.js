RegisterField({
    type: 'grid',
    display: 'Columns',
    buildNewModel: function (id) {
        return {
            showSeparator: false,
            columns: [
                {
                    'id': 'col_' + id + '_1',
                    'width': '1-2',
                    'fields': []
                },
                {
                    'id': 'col_' + id + '_2',
                    'width': '1-2',
                    'fields': []
                }]
        }
    },
    fieldTemplate: {
        template: `<cf_field :schema="schema"><div class="row uk-grid" v-bind:class="{'uk-grid-divider uk-grid-collapse': schema.showSeparator, 'uk-grid-medium': !schema.showSeparator}" uk-grid>
			    <div :class="'nested-sortable uk-width-'+ column.width + '@m'" style="min-height:60px" :id="column.id" :data-column="index" :data-grid="schema.id" v-for="(column,index) in schema.columns">  
				<component v-for="field in column.fields" 
				 :key="field.id"
				 :is="field.type"
				 v-model="$root.data[field.variable]"
				 :schema="field"></component>
			</div></div></cf_field>`,
        data: function () {
            if (this.schema.width === undefined) this.schema.width = 12;
            return {}
        },
        computed: {
        },
        props: ["value", "schema"],
    },

    editForm: {
        template: `<div>
                        <div class="uk-margin-small-bottom">
                            <label for="chkShowSeparator" class="uk-form-label"><input id="chkShowSeparator" class="uk-checkbox" type="checkbox" v-model="showSeparator"/> Show separator</label>
                        </div>
                    </div>`,
        data: function () {
            return this.value;
        },
        props: ["value"]
    }
});


var textInput = {
    type: 'textField',
    display: 'Input field',
    buildNewModel: function () {
        return { label: 'New label', variable: '', placeholder: '' }
    },
    fieldTemplate: {
        template: `<cf_field :schema="schema"><label :for="schema.id" class="uk-form-label">{{ schema.label }} <div class="required-tag" v-if="$isrequired"/></label><div class="uk-form-controls"><input :type="inputType" v-bind:class="{'uk-form-danger': this.$error}" :placeholder="schema.placeholder" class="uk-input uk-form-small" :id="schema.id" :value="value" @input="updateInput"></div><div class="error-message">{{this.$errorMessage}}&nbsp;</div></cf_field>`,
        data: function () {
            return {}
        },
        computed: {
            inputType: function () { return 'text'; }
        },
        methods: {
            updateInput: function () {
                this.$emit('input', this.$el.getElementsByTagName("input")[0].value)
                this.$touch();
            }
        },
        props: ["value", "schema"]
    },
    editForm: {
        template: `
                        <div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtLabel" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtValue" class="uk-form-label">Name</label>
                            <input id="txtValue" type="text" class="uk-input uk-form-small" v-model="variable" v-bind:class="{'uk-form-danger': $validation.variable.$error}"/>
                                    
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/>
                        </div>
                   </div>
`,
        validations: {
            'variable': {
                'required': required,
                'minLength':minLength(3)
            }
        },
        data: function () {
            return this.value;
        },
        props: ["value"]

    }
};

var passwordInput = {
    ...textInput, ...{
        type: 'passwordField',
        display: 'Password field',
        fieldTemplate: {
            ...textInput.fieldTemplate, ...{
                computed: {
                    ...textInput.fieldTemplate.computed, ...{
                        inputType: function () { return 'password'; }
                    }
                }
            }
        }

    }
};


var dateInput = {
    ...textInput, ...{
        type: 'dateField',
        display: 'Date field',
        fieldTemplate: {
            ...textInput.fieldTemplate, ...{
                computed: {
                    ...textInput.fieldTemplate.computed, ...{
                        inputType: function () { return 'date'; }
                    }
                }
            }
        }

    }
};


var emailInput = {
    ...textInput, ...{
        type: 'emailField',
        display: 'E-Mail field',
        fieldTemplate: {
            ...textInput.fieldTemplate, ...{
                computed: {
                    ...textInput.fieldTemplate.computed, ...{
                        inputType: function () { return 'email'; }
                    }
                }
            }
        }

    }
}


RegisterField(textInput);
RegisterField(passwordInput);
RegisterField(dateInput);
RegisterField(emailInput);


RegisterField({
    type: 'selectField',
    display: 'Dropdown select',
    buildNewModel: function () {
        return { label: 'New label', variable: '', placeholder: '', source: '', multiple: false }
    },
    fieldTemplate: {
        template:
            `<cf_field :schema="schema"><label :for="schema.id" class="uk-form-label">{{ schema.label }} <div class="required-tag" v-if="$isrequired"/></label>
                <div class="uk-form-control bt-select-field" v-bind:class="{'uk-form-danger': this.$error}">
	                <select @change="changeValue" class="bt-select-field no-autoinit uk-select" v-model="schema.id" :id="schema.id" :name="schema.id">
	                </select>
                </div>
                <div class="error-message">{{this.$errorMessage}}</div>
	        </cf_field>`,
        data: function () {
            return {}
        },
        computed: {
        },
        props: ["value", "schema"],
        mounted: function () {
            this.buildSelect2();
            this.$watch('schema', this.buildSelect2, { deep: true })
        },
        methods: {
            changeValue: function (evt) {
                this.$emit('input', evt.srcElement.value)
            },
            buildSelect2: function () {
                var vm = this;
                var el = $(this.$el).find('select');

                var dataObj = { data: this.options };
                if (this.schema.source !== undefined) {
                    dataObj = {
                        ajax: {
                            url: function (params) {
                                if (params.term === undefined) {
                                    return 'https://restcountries.eu/rest/v2/all?fields=name;flag;alpha3Code'
                                } else {
                                    return 'https://restcountries.eu/rest/v2/name/' + params.term + '?fields=name;flag;alpha3Code'
                                }
                            },
                            dataType: 'json',
                            delay: 250,
                            processResults: function (data, params) {
                                params.page = params.page || 1;
                                for (var i = 0; i < data.length; i++) {
                                    data[i].id = data[i].alpha3Code;
                                    data[i].text = data[i].name;
                                }
                                return {
                                    results: data
                                };
                            },
                            cache: true
                        },
                        placeholder: this.schema.placeholder,
                        minimumInputLength: this.schema.source.minimumInputLength,
                        multiple: this.schema.multiple
                    };
                }



                el.select2(dataObj)
                    .val(this.value)
                    .trigger("change")
                    // emit event on change.
                    .on("change", function () {
                        vm.$emit("input", $(this).val());
                    });
            }
        },
        watch: {
            value: function (value) {
                // update value
                $(this.$el)
                    .val(value)
                    .trigger("change");
            }
        },
        destroyed: function () {
            $(this.$el).find("select")
                .off()
                .select2("destroy");
        }
    },
    editForm: {
        template: `<div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtValue" class="uk-form-label">Name</label>
                            <input id="txtValue" type="text" class="uk-input uk-form-small" v-model="variable"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="txtPlaceholder" class="uk-form-label">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/>
                        </div>
                        <div class="uk-margin-small-bottom">
                            <label for="chkMultiple" class="uk-form-label"><input id="chkMultiple" class="uk-checkbox" type="checkbox" v-model="multiple"/> Allow multiple selection</label>
                        </div>
                    </div>`,
        data: function () {
            return this.schema;
        },

        props: ["schema"]

    }
});








