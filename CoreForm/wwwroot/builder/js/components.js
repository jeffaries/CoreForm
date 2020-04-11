Vue.component('cf_toolbutton', {
    template: `<div v-on:click="click()" :class="'toolbar-button ' + cssclass"><img :src="'./img/'+ icon +'.svg'"/></div>`,
    data: function () {
        return {}
    },
    props: ["onclick", "cssclass", "icon"],
    methods: {
        click: function (evt) {
            eval(this.onclick);
        }
    }
});

Vue.component('cf_field', {
    template: `<div :data-ref="id" class="sortable-item"><div class="toolbar"><cf_toolbutton icon="move" cssclass="moveHandle"/><cf_toolbutton icon="settings" :onclick="'openSettings(&quot;'+ id +'&quot;)'"/><cf_toolbutton icon="trash" cssclass="deleteHandle"/></div><slot></slot></div>`,
    data: function () {
        return {}
    },
    props: ["id"]
});




RegisterField({
    type: 'grid',
    display: 'Columns',
    fieldTemplate: {
        template: `<cf_field :id="id"><div class="row gridrow">
			    <div :class="'col nested-sortable s12 m' + column.width" :id="column.id" :data-column="index" :data-grid="id" v-for="(column,index) in columns">  
				<component v-for="field in column.fields" 
				 :key="field.id"
                 
				 :is="field.type"
				 v-model="$root.data[field.id]"
				 v-bind="field"></component>
			</div></div></cf_field>`,
        data: function () {
            if (this.width === undefined) this.width = 12;
            return {}
        },
        computed: {
        },
        props: ["id", "label", "value", "columns"]
    },

    editForm: {
        template: `<div>Test Grid</div>`,
        data: function () {
            return {}
        }

    }
});


RegisterField({
    type: 'textField',
    display: 'Input field',
    fieldTemplate: {
        template: `<cf_field :id="id"><label :for="id" class="uk-form-label">{{ label }}</label><div class="uk-form-controls"><input type="text" :placeholder="placeholder" class="uk-input uk-form-small" :id="id" :value="value" @input="updateInput"></div></cf_field>`,
        data: function () {
            if (this.width === undefined) this.width = 12;
            return {
            }
        },
        computed: {
        },
        methods: {
            updateInput: function () {
                this.$emit('input', this.$el.getElementsByTagName("input")[0].value)
            }
        },
        props: ["label", "id", "value", "width", "placeholder"]
    },
    editForm: {
        template: `<div>
                        <div>
                            <label for="txtValue">Name</label>
                            <input id="txtValue" type="text" class="uk-input uk-form-small" v-model="variable"/></div>
                        <div>
                            <label for="txtPlaceholder">Placeholder text</label>
                            <input id="txtPlaceholder" type="text" class="uk-input uk-form-small" v-model="placeholder"/></div>
                        <div>
                            <label for="txtPlaceholder">Label text</label>
                            <input id="txtLabel" type="text" class="uk-input uk-form-small" v-model="label"/></div>
                   </div>`,
        computed: {
        },
        data() {
            return this.value;
        },
        props: ["value"]

    }
});



RegisterField({
    type: 'selectField',
    display: 'Dropdown select',
    fieldTemplate: {
        template:
            `<cf_field :id="id"><label :for="id" class="uk-form-label">{{ label }}</label>
<div class="uk-form-control bt-select-field">
	<select @change="changeValue" class="bt-select-field no-autoinit uk-select" v-model="id" :id="id" :name="id">
	</select></div>
	</cf_field>`,
        data: function () {
            if (this.width === undefined) this.width = 12;
            return {}
        },
        methods: {
            changeValue: function (evt) {
                this.$emit('input', evt.srcElement.value)
            }
        },
        computed: {
        },
        props: ["label", "id", "options", "value", "width", "source"],
        mounted: function () {
            var vm = this;
            var el = $(this.$el).find('select');

            var dataObj = { data: this.options };
            if (this.source !== undefined) {
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
                    placeholder: 'Select an option',
                    minimumInputLength: this.source.minimumInputLength,
                    multiple: 'multiple'
                };
            }



            el.select2(dataObj)
                .val(this.value)
                .trigger("change")
                // emit event on change.
                .on("change", function () {
                    vm.$emit("input", $(this).val());
                });
        },
        watch: {
            value: function (value) {
                // update value
                $(this.$el)
                    .val(value)
                    .trigger("change");
            },
            options: function (options) {
                // update options
                $(this.$el)
                    .empty()
                    .select2({ data: options });
            }
        },
        destroyed: function () {
            /*$(this.$el)
                .off()
                .select2("destroy");*/
        }
    },
    editForm: {
        template: `<div>Test Textbox {{id}}</div>`,

    }
});








