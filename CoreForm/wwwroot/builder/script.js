var id = 100;

$(document).ready(function () {

    const app = new Vue({
        el: '#app',
        data() {
            return {
                data: formData,
                schema: formSchema
            }
        },
        methods: {
            add() {
                id++;
                this.schema.fields.splice(1, 0, {
                    'id': 'ctrl_' + id,
                    'label': 'Name',
                    'type': 'textField'
                });
            },
            show() {
                alert(JSON.stringify(this.data));
            }
        }
    });

    configureNestedTables();

    $('select').formSelect();
    M.updateTextFields();
    M.AutoInit();
});


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
            name: 'share'
        },
        removeOnSpill: true,
        animation: 150,
        fallbackOnBody: true,
        swapThreshold: 0.25,
        ghostClass: 'blue-background-class',
        dragClass: 'yellow-background-class',
        onAdd: function (evt) {
            var elName;
            if (evt.pullMode == "clone") {

                var item = $(evt.item);
                var component = componentObjects[item.data("type")];


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
                if (fieldConfig != null) {
                    $("#editForm .modal-body").html(fieldConfig.htmlForm);
                    vm = new Vue({ el: '#editForm', data: fieldConfig.dataModel });

                    $('#editForm').modal('show').on('hide.bs.modal', function () {
                        elName = $("#ctrlName").val();
                        if (elName == "") {
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
        }
    });
}



