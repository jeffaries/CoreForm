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
                    fields: [],
                    variables: []
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
                var schema = this.schema;
                $.ajax({
                    url: url,
                    type: "POST",
                    data: JSON.stringify(schema),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    success: function (data) {
                        UIkit.modal.alert("Successfully saved");
                        Object.assign(schema, data);
                    }
                });
            },
            openSettingsByObject: function (obj, callback) {
                this.$refs.editFormModal.show(obj, function (model) {
                    Object.assign(obj, model);
                    if (callback) callback(obj);
                });

            },
            openSettingsById: function (id) {
                var obj = findSchemaObjectById(id, this.schema);
                this.openSettingsByObject(obj);

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
            applyToolbarEvents: function () {
                $(".sortable-item").mousemove(function (event) {
                    event.stopPropagation();
                    $(".toolbar").hide();
                    $(this).find("> .toolbar").show();
                });
                $(".sortable-item").mouseleave(function () {
                    event.stopPropagation();
                    $(this).find("> .toolbar").hide();
                });
            },
            configureNestedTables: function () {
                var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));
                var app = this;
                // Loop through each nested sortable element
                for (var i = 0; i < nestedSortables.length; i++) {
                    new Sortable(nestedSortables[i], {
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
                                var newId = 'ctrl_' + app.getNextId(app.schema);
                                var model = registeredFields.get(item.data("type")).buildNewModel(newId);
                                model.id = newId
                                model.type = item.data("type")

                                var newIndex = evt.newDraggableIndex;
                                var collTo = findDataCollectionByElement($(evt.to), app.schema);
                                item.remove();

                                app.openSettingsByObject(model, function (model) {
                                    collTo.splice(newIndex, 0, model);
                                    app.$nextTick(function () { app.configureNestedTables(); });

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
                            app.configureNestedTables();
                        }
                    });

                }
            },
            getNextId: function (schema) {
                var highestId = 0;
                var tranverseDataNodes = function (node, func) {
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
                tranverseDataNodes(schema, function (node) {
                    if (typeof (node.id) !== 'undefined') {
                        var sId = node.id;
                        if (sId.startsWith("ctrl_")) {
                            iId = parseInt(sId.substring(5));
                            if (iId > highestId) highestId = iId;
                        }
                    }
                });
                return highestId + 1;
            }
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
                this.applyToolbarEvents();
            })
        },
        mounted: function () {
            this.$nextTick(function () {
                // Update events to ensure that toolbar will appear for newly added items
                this.applyToolbarEvents();


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

                this.configureNestedTables();

                editFormModal = UIkit.modal(document.getElementById("editForm"));


            })
        }
    });


});

function findSchemaObjectById(id, schema) {
    if (id === "formContainer") return schema;
    var findSchemaObjectByNode = function (node, id) {
        var subColl = null;
        if (typeof (node.columns) !== "undefined") subColl = node.columns;
        if (typeof (node.fields) !== "undefined") subColl = node.fields;

        if (id === node.id) {
            return node;
        } else {
            if (subColl !== null) {
                for (var i = 0; i < subColl.length; i++) {
                    var res = findSchemaObjectByNode(subColl[i], id);
                    if (res !== null) return res;
                }
            }
        }
        return null;
    }
    return findSchemaObjectByNode(schema, id)
}
function findDataCollectionByElement(element, schema) {
    var id = null;
    if ($(element).attr("id")) id = $(element).attr("id");
    else if ($(element).data("ref")) id = $(element).data("ref");

    if (id === "formContainer") return schema.fields;
    var findDataCollectionInDataNode = function (node, id) {
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

    return findDataCollectionInDataNode(schema, id)
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






