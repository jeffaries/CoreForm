var app, editFormModal, editVm;
var editControls = new Map();

$(document).ready(function () {
    var schema = {
        'schemaVersion': 1,
        'formVersion': 0,
        'name': '',
        'title': 'New form schema',
        fields: []
    };



    app = new Vue({
        el: '#app',
        data: function () {
            return {
                data: {},
                schema: {
                    'schemaVersion': 1,
                    'formVersion': 0,
                    'name': 'FirstSchema',
                    'title': 'My first schema',
                    fields: []
                },
                editformdata: {},
                editformId: ''
            }
        },
        validations: function () {
            var obj = { data: {}, editformdata: this.editformdata.validations };

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


            saveSchema: function () {
                var url = "/Form/NewModel";
                var urlParams = new URLSearchParams(window.location.search);
                var schemaId = urlParams.get('schemaid');
                if (schemaId !== undefined && schemaId !== "") {
                    url = "/Form/" + schemaId + "/save";
                }

                $.ajax({
                    url: url,
                    type: "POST",
                    data: JSON.stringify(this.schema),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        alert("Data Loaded: " + data);
                    }
                });
            },


            openSettingsById: function (id) {
                var obj = findSchemaObjectById(id, this.schema);
                openSettingsByObject(obj, function (model) {
                    Object.assign(obj, model);
                })
            },

            removeNodeById: function (id) {
                var schema = this.schema;

                UIkit.modal.confirm('Are you sure to want to delete this field?').then(function () {

                    var obj = findSchemaObjectById(id, schema);
                    var coll = findParentCollectionForDataNode(schema, id);
                    const index = coll.indexOf(obj);
                    if (index > -1) {
                        coll.splice(index, 1);
                    }

                }, function () {
                    
                });



            },



        },
        created: function () {
            // `this` est une référence à l'instance de vm
            for (let [key, value] of registeredFields.entries()) {
                this.$options.components[key] = value.fieldTemplate;
                editControls.set('edit_' + key, value.editForm);
                editControls.set(key, value.fieldTemplate);

            }
            for (let [key, value] of Object.entries(this.$options.components)) {
                value.components = this.$options.components;
            }

            var urlParams = new URLSearchParams(window.location.search);
            var schemaId = urlParams.get('schemaid');
            var root = this;
            if (schemaId !== null && typeof (schemaId) !== 'undefined' && schemaId !== "") {
                $.ajax({
                    url: "/Form/" + schemaId + "/schema",
                    type: "GET",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        root.schema = data;
                    }
                });
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


                var toolbar = document.getElementById('mnuComponents');
                new Sortable(toolbar, {
                    group: {
                        name: 'share',
                        pull: 'clone', // To clone: set pull to 'clone'
                        put: false
                    },
                    draggale: '.uk-button',
                    animation: 0,
                    fallbackOnBody: true,
                    sort: false,
                    dragClass: 'yellow-background-class',
                });

                configureNestedTables(this);

                editFormModal = UIkit.modal(document.getElementById("editForm"));


            })
        }
    });

    editVm = new Vue({
        el: '#editForm',
        data: function () {
            return {
                editformId: Date.now(),
                editformdata: {}
            };
        },
        validations: function () {
            var v = this.$options.components['edit_' + this.editformdata.type].validations;
            var obj = {
                editformdata: {}
            };
            if (v) {
                for (let [key, value] of Object.entries(v)) {
                    if (!key.startsWith("$")) obj.editformdata[key] = value;
                }
            }

            return obj;

        },
        created: function () {
            for (let [key, value] of editControls.entries()) {
                this.$options.components[key] = value;
            }
        },
        watch: {
            editformdata: function (evt) {
                this.$v.$reset();
            }
        },
        methods: {
            applyEdit: function () {
                this.$v.$touch();
                if (!this.$v.$error) {
                    editFormModal.hide();
                    if (editFormModal_callback !== null && typeof (editFormModal_callback) !== 'undefined') {
                        var obj = Object.assign({}, this.editformdata);
                        editFormModal_callback(obj);
                        this.editformdata = Object.assign(this.editformdata, {});
                    }
                }

            },
        }
    });
});


var editFormModal_callback = null;

function openSettingsByObject(obj, callback) {
    editFormModal_callback = callback;
    editFormModal.show();
    editVm.editformId = Date.now();
    editVm.editformdata = Object.assign({}, obj);
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


function configureNestedTables(app) {
    var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

    // Loop through each nested sortable element
    for (var i = 0; i < nestedSortables.length; i++) {
        configureNestedTable(nestedSortables[i], app);
    }
}

function configureNestedTable(table, app) {
    new Sortable(table, {
        group: {
            name: 'share',
        },
        draggale: '.sortable-item',
        handle: '.moveHandle',
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.25,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-dragitem',
        onAdd: function (evt) {
            var elName;
            if (evt.pullMode === "clone") {
                var item = $(evt.item);

                var newId = 'ctrl_' + getNextId(app.schema);
                var model = registeredFields.get(item.data("type")).buildNewModel(newId);
                model.id = newId
                model.type = item.data("type")

                var newIndex = evt.newDraggableIndex;
                var collTo = findDataCollectionByElement($(evt.to), app.schema);
                item.remove();

                openSettingsByObject(model, function (model) {
                    collTo.splice(newIndex, 0, model);
                    app.$nextTick(function () { configureNestedTables(app); });

                });

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

            var item = findSchemaObjectById($(evt.clone).data("ref"), this);
            var collFrom = findDataCollectionByElement($(evt.from), this);
            var collTo = findDataCollectionByElement($(evt.to), this);

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

            configureNestedTables(this);
        }
    });


}

function getNextId(schema) {
    return getHighestControlId(schema) + 1;
}

function getHighestControlId(schema) {
    var highestId = 0;
    tranverseDataNodes(schema, function (node) {
        if (typeof (node.id) !== 'undefined') {
            var sId = node.id;
            if (sId.startsWith("ctrl_")) {
                iId = parseInt(sId.substring(5));
                if (iId > highestId) highestId = iId;
            }
        }
    });
    return highestId;
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

function findSchemaObjectById(id, schema) {
    if (id === "formContainer") return schema;
    return findDataObjectByDataNode(schema, id)
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

function findDataCollectionByElement(element, schema) {
    var id = null;
    if ($(element).attr("id")) id = $(element).attr("id");
    else if ($(element).data("ref")) id = $(element).data("ref");

    if (id === "formContainer") return schema.fields;
    return findDataCollectionInDataNode(schema, id)
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

function findParentCollectionForDataNode(node, id) {
    var subColl = null;
    if (typeof (node.columns) !== "undefined") subColl = node.columns;
    if (typeof (node.fields) !== "undefined") subColl = node.fields;

    if (subColl === null) return null;

    for (var i = 0; i < subColl.length; i++) {

        if (subColl[i].id && subColl[i].id === id) {
            return subColl;
        }

        var res = findParentCollectionForDataNode(subColl[i], id);
        if (res !== null) return res;
    }

    return null;
}






