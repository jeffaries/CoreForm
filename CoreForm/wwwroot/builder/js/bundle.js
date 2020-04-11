var id = 100;
var app, editFormModal;

var registeredFields = new Map();

$(document).ready(function () {


    app = new Vue({
        el: '#app',
        data: function () {
            return {
                data: {},
                schema: {
                    'schemaVersion': 1,
                    'formVersion': 0,
                    'name': 'FirstSchema',
                    fields: []
                },
                editformdata: {}

            }
        },
        methods: {
            addTxt: function () {
                id++;
                this.schema.fields.push({
                    'id': 'ctrl_' + id,
                    'label': 'Name',
                    'type': 'textField',
                    'variable': '',
                    'placeholder':'Input text here'
                });
            },
            addSel: function () {
                id++;
                this.schema.fields.push({
                    'id': 'ctrl_' + id,
                    'label': 'Country',
                    'type': 'selectField',
                    'source': 'country123'
                });
            },
            applyEdit: function () {
                var obj = findSchemaObjectById(this.editformdata.id);
                Object.assign(obj, this.editformdata);
                editFormModal.hide();
                Object.assign(this.editformdata, {});
            },
            saveSchema: function () {
                $.ajax({
                    url: "/Form/NewModel",
                    type: "POST",
                    data: JSON.stringify(this.schema),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        alert("Data Loaded: " + data);
                    }
                });



            }
        },
        created: function () {
            // `this` est une r�f�rence � l'instance de vm
            for (let [key, value] of registeredFields.entries()) {
                this.$options.components[key] = value.fieldTemplate;
                this.$options.components['edit_' + key] = value.editForm;
            }
            for (let [key, value] of Object.entries(this.$options.components)) {
                value.components = this.$options.components;
            }

        },
        updated: function () {
            this.$nextTick(function () {
                // Update events to ensure that toolbar will appear for newly added items
                applyToolbarEvents();
            })
        },
        mounted: function () {
            this.$nextTick(function () {
                // Update events to ensure that toolbar will appear for newly added items
                applyToolbarEvents();

                configureNestedTables();

                M.updateTextFields();
                M.AutoInit();

                $('select').not(".select2").not(".select2-ajax").formSelect();


                editFormModal = UIkit.modal(document.getElementById("editForm"));


            })
        }
    });


});

function RegisterField(fieldDefinition) {
    registeredFields.set(fieldDefinition.type, fieldDefinition);
}


function openSettings(id) {
    var vmEditForm;
    editFormModal.show();
            var obj = findSchemaObjectById(id);
    var comp = registeredFields.get(obj.type).editForm;
    app.editformdata = Object.assign({}, obj);
    //document.getElementById("editFormBody").innerHTML =

}

function applyToolbarEvents() {
    $(".sortable-item").mousemove(function (event) {
        event.stopPropagation();
        $(".toolbar").hide();
        $(this).find("> .toolbar").show();
    });
    $(".sortable-item").mouseleave(function () {
        event.stopPropagation();
        $(this).find("> .toolbar").hide();
    });
}


function configureNestedTables() {
    var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

    // Loop through each nested sortable element
    for (var i = 0; i < nestedSortables.length; i++) {
        configureNestedTable(nestedSortables[i]);
    }
}

function configureNestedTable(table) {
    new Sortable(table, {
        group: {
            name: 'share',
        },
        draggale: '.sortable-item',
        handle: '.moveHandle',
        //removeOnSpill: true,
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.25,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-dragitem',
        onAdd: function (evt) {
            var elName;
            if (evt.pullMode === "clone") {

                var item = $(evt.item);

                var callback = function (config) {
                    var newHtml = component.GetEditFieldTemplate(config);

                    if (newHtml != '') {
                        var newItem = $(newHtml);
                        item.replaceWith(newItem);
                        var dataType = item.data("type");
                        newItem.attr("data-type", dataType);
                        newItem.attr("data-name", elName);
                        newItem.attr('id', "ctrl_" + ctrlIndex++);
                        if (config != null) {
                            newItem.data("config", config);
                        }
                        configureNestedTables();
                    }
                }

                var fieldConfig = component.GetFieldConfiguration(null);
                if (fieldConfig !== null) {
                    $("#editForm .modal-body").html(fieldConfig.htmlForm);
                    vm = new Vue({ el: '#editForm', data: fieldConfig.dataModel });

                    $('#editForm').modal('show').on('hide.bs.modal', function () {
                        elName = $("#ctrlName").val();
                        if (elName === "") {
                            $(evt.item).remove();
                        }
                        else {
                            callback(vm.$data); //replace null with the result of the modal
                        }
                    })
                } else {
                    callback(null);
                }




            }



        },
        onEnd: function (/**Event*/evt) {
            var itemEl = evt.item;  // dragged HTMLElement
            evt.to;    // target list
            evt.from;  // previous list
            evt.oldIndex;  // element's old index within old parent
            evt.newIndex;  // element's new index within new parent
            evt.oldDraggableIndex; // element's old index within old parent, only counting draggable elements
            evt.newDraggableIndex; // element's new index within new parent, only counting draggable elements
            evt.clone // the clone element
            evt.pullMode;  // when item is in another sortable: `"clone"` if cloning, `true` if moving

            var item = findSchemaObjectById($(evt.clone).data("ref"));
            var collFrom = findDataCollectionByElement($(evt.from));
            var collTo = findDataCollectionByElement($(evt.to));

            if (typeof (item) !== 'undefined' && typeof (collFrom) !== 'undefined' && typeof (collTo) !== 'undefined') {
                var newIndex = evt.newDraggableIndex;
                var oldIndex = evt.oldDraggableIndex;
                if (collFrom === collTo) {
                    if (newIndex > oldIndex) {
                        newIndex++;
                    } else {
                        oldIndex++;
                    }
                }
                collTo.splice(newIndex, 0, item);
                collFrom.splice(oldIndex, 1);
            }
        }
    });


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
        if (subColl != null) {
            for (var i = 0; i < subColl.length; i++) {
                var res = findDataObjectByDataNode(subColl[i], id);
                if (res != null) return res;
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

    if (subColl == null) return null;

    if (id === node.id) {
        return subColl;
    } else {
        for (var i = 0; i < subColl.length; i++) {
            var res = findDataCollectionInDataNode(subColl[i], id);
            if (res != null) return res;
        }
    }
    return null;
}







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