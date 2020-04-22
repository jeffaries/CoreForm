Vue.component('cf_toolbutton', {
    template: `<div v-on:click="click()" :class="'toolbar-button ' + cssclass"><img :src="'./img/'+ icon +'.svg'"/></div>`,
    data: function () {
        return {}
    },
    props: ["onclick", "cssclass", "icon"],
    methods: {
        click: function (evt) {
            this.onclick();
        }
    }
});

Vue.component('cf_field', {
    template: `<div :data-ref="id" :type="type" class="cf_validationError sortable-item uk-margin-small-bottom"><div class="toolbar"><label v-if="variableText">Data: {{variableText}}</label><cf_toolbutton icon="move" cssclass="uk-drag moveHandle"/><cf_toolbutton icon="settings" :onclick="openSettings"/><cf_toolbutton icon="trash" cssclass="deleteHandle" :onclick="removeNode"/></div><slot></slot></div>`,
    data: function () {
        return this.schema
    },
    computed: {
        variableText: function(){
            if (typeof (this.variable) !== "undefined") {
                return this.variable;
            }
            else {
                return "";
            }
        }
    },
    methods: {
        openSettings: function (evt) {
            this.$root.openSettingsById(this.id);
        },
        removeNode: function (evt) {
            this.$root.removeNodeById(this.id);
        }
    },
    props: ["schema","validation"]
});


Vue.component('cf_editfieldmodal', {
    template: `<div :ref="editformId" :id="editformId" class="uk-flex-top" uk-modal v-cloak>
        <div class="uk-modal-dialog uk-margin-auto-vertical ">
            <button class="uk-modal-close-default" type="button" uk-close></button>
            <!--<div class="uk-modal-header">
                <h2 class="uk-modal-title">Settings</h2>
            </div>-->
            <div class="uk-modal-body uk-form-stacked" id="editFormBody">
                <div>
                    <ul uk-tab>
                        <li><a href="#">Basic</a></li>
                        <li><a href="#">Debug</a></li>
                    </ul>
                    <ul class="uk-switcher uk-margin" uk-overflow-auto>
                        <li>
                            <component :key="editformId" :is="'edit_' + field.type" v-bind="field" v-model="field"></component>
                        </li>
                        <li>
                            <pre><code>{{field}}</code></pre>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="uk-modal-footer uk-text-right">
                <button class="uk-button uk-button-default uk-modal-close" type="button">Cancel</button>
                <button class="uk-button uk-button-primary" type="button" @click="applyEdit()">Apply</button>
            </div>
        </div>
    </div>`,
    data: function () {
        return {
            editformId: Date.now(),
            editformFieldId: Date.now(),
            field: {},
            callback: function(obj){}
        };
    },
    validations: function () {
        //var v = this.$options.components['edit_' + this.field.type].validations;
        var obj = {
            field: {}
        };
        //if (v) {
        //    for (let [key, value] of Object.entries(v)) {
        //        if (!key.startsWith("$")) obj.editformdata[key] = value;
        //    }
        //}
        //obj.field.variable = {
        //    'required': required,
        //    'minLength': minLength(3)
        //};

        return obj;

    },
    created: function () {

    },
    mounted: function() {
        var o = 1;
    },
    watch: {
        field: function (evt) {
            //this.$v.$reset();
        }
    },
    methods: {
        show: function (field, callback) {
            this.field = field; 
            this.callback = callback;

            for (let [key, value] of registeredFields.entries()) {
                this.$options.components[key] = value.fieldTemplate;
                this.$options.components['edit_' + key] = value.editForm;
            }
            for (let [key, value] of Object.entries(this.$options.components)) {
                value.components = this.$options.components;
            }

            UIkit.modal(document.getElementById(this.editformId)).show();
        },

        applyEdit: function () {
            this.$v.$touch();
            if (!this.$v.$error) {
                UIkit.modal(document.getElementById(this.editformId)).hide();
                if (this.callback !== null && typeof (this.callback) !== 'undefined') {
                    var obj = Object.assign({}, this.field);
                    this.callback(obj);
                    Object.assign(this.field, {});
                }
            }

        },
    }
});

