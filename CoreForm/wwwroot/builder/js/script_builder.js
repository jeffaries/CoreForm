


Vue.component('v-formbuilder', {
    template: `<div v-cloak>
                    <div class="uk-grid-small uk-grid-divider" uk-grid>
                        <div class="uk-width-1-5@m">
                            <div>
                                <div>
                                    <label class="uk-form-label" for="formName">Name:</label>
                                    <input id="formName" class="uk-input uk-form-small" v-model="schema.name" />
                                </div>
                                <div>
                                    <label class="uk-form-label" for="formTitle">Title:</label>
                                    <input id="formTitle" class="uk-input uk-form-small" v-model="schema.title" />
                                </div>
                            </div>

                            <div id="mnuComponents" style="margin-bottom:1em;margin-top:1em;">
                                <a class="uk-button uk-button-default uk-button-small uk-width-1-1" data-type="textField" @click="addTxt()">
                                    Text input
                                </a>
                                <a class="uk-button uk-button-default uk-button-small uk-width-1-1" data-type="passwordField">
                                    Password input
                                </a>
                                <a class="uk-button uk-button-default uk-button-small uk-width-1-1" data-type="richtextField">
                                    Richtext Field
                                </a>
                                <a class="uk-button uk-button-default uk-button-small uk-width-1-1" data-type="selectField">
                                    Selector
                                </a>
                                <a class="uk-button uk-button-default uk-button-small uk-width-1-1" data-type="grid" @click="addGrid()">
                                    Columns
                                </a>
                            </div>
                            <button class="uk-button uk-button-primary uk-button-small uk-width-1-1" @click="saveSchema()">Save</button>

                        </div>
                        <div class="uk-width-3-5@m">
                            <fieldset class="uk-fieldset">
                                <div class="uk-card uk-card-default uk-card-body">
                                    <h3 class="uk-card-title">{{schema.title}}</h3>
                                    <div id="formContainer" data-ref="root" class="nested-sortable uk-form-stacked" style="padding:10px;min-height:60px">
                                        <component v-for="field in schema.fields"
                                                    :key="field.id"
                                                    :is="field.type"
                                                    :schema="field"
                                                    v-model="data[field.variable]">
                                        </component>
                                    </div>
                                    <small>version {{schema.formVersion}}</small>
                                </div>
                            </fieldset>
                            <ul uk-accordion="multiple: true">
                                <li>
                                    <a class="uk-accordion-title" href="#">Schema</a>
                                    <div class="uk-accordion-content"><pre><code>{{ schema }}</code></pre></div>
                                </li>
                                <li>
                                    <a class="uk-accordion-title" href="#">Data</a>
                                    <div class="uk-accordion-content"><pre><code>{{ data }}</code></pre></div>
                                </li>
                            </ul>

                        </div>
                    </div>
                    <cf_editfieldmodal ref="editFormModal" />
                </div>`,
    data: function () {
        return this.$parent;
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
            var obj = this.findNodeById(id, this.schema);
            this.openSettingsByObject(obj);

        },
        removeNodeById: function (id) {
            var schema = this.schema;
            var app = this;
            UIkit.modal.confirm('Are you sure to want to delete this field?').then(function () {
                var obj = app.findNodeById(id, schema);
                var coll = app.findParentNodeCollectionById(schema, id);
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
            var _parent = this;
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
                            var newId = 'ctrl_' + _parent.getNextId(_parent.schema);
                            var model = registeredFields.get(item.data("type")).buildNewModel(newId);
                            model.id = newId
                            model.type = item.data("type")

                            var newIndex = evt.newDraggableIndex;
                            var collTo = _parent.findNodeCollectionByDomElement($(evt.to), _parent.schema);
                            item.remove();

                            _parent.openSettingsByObject(model, function (model) {
                                collTo.splice(newIndex, 0, model);
                                _parent.$nextTick(function () { _parent.configureNestedTables(); });

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

                        var item = _parent.findNodeById($(evt.clone).data("ref"), this);
                        var collFrom = _parent.findNodeCollectionByDomElement($(evt.from), this);
                        var collTo = _parent.findNodeCollectionByDomElement($(evt.to), this);

                        if (item && collFrom && collTo) {
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
                        _parent.configureNestedTables();
                    }
                });

            }
        },
        getNextId: function (schema) {
            var highestId = 0;
            var _s = function (node, func) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                func(node);
                if (subColl !== null) {
                    for (var i = 0; i < subColl.length; i++) {
                        _s(subColl[i], func);
                    }
                }
            }
            _s(schema, function (node) {
                if (typeof (node.id) !== 'undefined') {
                    var sId = node.id;
                    if (sId.startsWith("ctrl_")) {
                        iId = parseInt(sId.substring(5));
                        if (iId > highestId) highestId = iId;
                    }
                }
            });
            return highestId + 1;
        },

        findNodeById: function (id, schema) {
            if (id === "formContainer") return schema;
            var __s = function (node, id) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                if (id === node.id) {
                    return node;
                } else {
                    if (subColl !== null) {
                        for (var i = 0; i < subColl.length; i++) {
                            var res = __s(subColl[i], id);
                            if (res !== null) return res;
                        }
                    }
                }
                return null;
            }
            return __s(schema, id)
        },

        findNodeCollectionByDomElement: function (element, schema) {
            var id = null;
            if ($(element).attr("id")) id = $(element).attr("id");
            else if ($(element).data("ref")) id = $(element).data("ref");

            if (id === "formContainer") return schema.fields;
            var __s = function (node, id) {
                var subColl = null;
                if (typeof (node.columns) !== "undefined") subColl = node.columns;
                if (typeof (node.fields) !== "undefined") subColl = node.fields;
                if (subColl === null) return null;
                if (id === node.id) {
                    return subColl;
                } else {
                    for (var i = 0; i < subColl.length; i++) {
                        var res = __s(subColl[i], id);
                        if (res !== null) return res;
                    }
                }
                return null;
            }

            return __s(schema, id)
        },
        findParentNodeCollectionById: function (node, id) {
            var subColl = null;
            if (typeof (node.columns) !== "undefined") subColl = node.columns;
            if (typeof (node.fields) !== "undefined") subColl = node.fields;

            if (subColl === null) return null;

            for (var i = 0; i < subColl.length; i++) {

                if (subColl[i].id && subColl[i].id === id) {
                    return subColl;
                }

                var res = this.findParentNodeCollectionById(subColl[i], id);
                if (res !== null) return res;
            }

            return null;
        }


    },
    created: function () {
        // `this` est une r�f�rence � l'instance de vm
        for (let [key, value] of registeredFields.entries()) {
            this.$options.components[key] = value.fieldTemplate;
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

        })
    }
});








