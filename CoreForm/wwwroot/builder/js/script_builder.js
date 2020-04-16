var app, editFormModal;


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
            addTxt: function () {
                this.schema.fields.push({
                    'id': 'ctrl_' + getNextId(),
                    'label': 'Name',
                    'type': 'textField',
                    'variable': '',
                    'placeholder': 'Input text here'
                });
            },
            addSel: function () {
                this.schema.fields.push({
                    'id': 'ctrl_' + getNextId(),
                    'label': 'Country',
                    'type': 'selectField',
                    'source': 'country123'
                });
            },
            addGrid: function () {
                var id = getNextId();
                this.schema.fields.push({

                    'id': 'ctrl_' + id,
                    'type': 'grid',
                    columns: [
                        {
                            'id': 'row_' + id + '_1',
                            'width': '1-2',
                            'fields': []
                        },
                        {
                            'id': 'row_' + id + '_2',
                            'width': '1-2',
                            'fields': []
                        }]
                });
            },
            applyEdit: function () {
                editFormModal.hide();
                if (editFormModal_callback !== null && typeof (editFormModal_callback) !== 'undefined') {
                    var obj = Object.assign({}, this.editformdata);
                    editFormModal_callback(obj);
                }
                this.editformdata = Object.assign(this.editformdata, {});
            },
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



            }
        },
        created: function () {
            // `this` est une référence à l'instance de vm
            for (let [key, value] of registeredFields.entries()) {
                this.$options.components[key] = value.fieldTemplate;
                this.$options.components['edit_' + key] = value.editForm;
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

                configureNestedTables();

                editFormModal = UIkit.modal(document.getElementById("editForm"));


            })
        }
    });


});


var editFormModal_callback = null;

function openSettingsById(id) {
    var obj = findSchemaObjectById(id);
    openSettingsByObject(obj, function (model) {
        Object.assign(obj, app.editformdata);
    });
}

function openSettingsByObject(obj, callback) {
    var vmEditForm;
    editFormModal_callback = callback;
    app.editformId = Date.now();
    editFormModal.show();
    var comp = registeredFields.get(obj.type).editForm;
    app.editformdata = Object.assign({}, obj);
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
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.25,
        ghostClass: 'sortable-ghost',
        dragClass: 'sortable-dragitem',
        onAdd: function (evt) {
            var elName;
            if (evt.pullMode === "clone") {
                var item = $(evt.item);

                var newId = 'ctrl_' + getNextId();
                var model = registeredFields.get(item.data("type")).buildNewModel(newId);
                model.id = newId
                model.type = item.data("type")

                var newIndex = evt.newDraggableIndex;
                var collTo = findDataCollectionByElement($(evt.to));
                item.remove();


                openSettingsByObject(model, function (model) {
                    collTo.splice(newIndex, 0, model);
                    app.$nextTick(function () { configureNestedTables(); });

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

            configureNestedTables();
        }
    });


}

function getNextId() {
    return getHighestControlId() + 1;
}

function getHighestControlId() {
    var highestId = 0;
    tranverseDataNodes(app.schema, function (node) {
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






