var ctrlIndex = 0;

var toolbar;
var designSurface;
var components;
var componentObjects = new Array();

var vm;

$(document).ready(function() {  

	var components =
	[
		{ type : "textbox", 	obj : new c_textbox()},
		{ type : "select", 	obj : new c_select()},
		{ type : "table", 		obj : new c_table()}
	];

	for (var i = 0; i < components.length; i++) {
	  componentObjects[components[i].type] = components[i].obj;
	} 
	
	var toolBar_vue = new Vue({
	  el: '#toolBar',
	  data: {
		items: components
	  }
	});
	

	toolbar = document.getElementById('toolBar');
	designSurface = document.getElementById('designSurface')
	
		// Nested demo
	configureNestedTables();
	
	
	// Example 3 - Cloning
	new Sortable(toolbar, {
		group: {
			name: 'share',
			pull: 'clone' // To clone: set pull to 'clone'
		},
		animation: 150,
		sort: false,
		put: false,
		dragClass: 'yellow-background-class',
	});




});


function configureNestedTables(){
	var nestedSortables = [].slice.call(document.querySelectorAll('.nested-sortable'));

	// Loop through each nested sortable element
	for (var i = 0; i < nestedSortables.length; i++) {
		configureNestedTable(nestedSortables[i]);
	}
}

function configureNestedTable(table){
	new Sortable(table, {
		group: {
			name: 'share'
		  },
		removeOnSpill: true,
		animation: 150,
		fallbackOnBody: true,
		swapThreshold: 0.65,
		ghostClass: 'blue-background-class',
		dragClass: 'yellow-background-class',
		onAdd: function (evt) {
			var elName;
			if(evt.pullMode=="clone"){
				
				var item = $(evt.item);	
				var component = componentObjects[item.data("type")];
			
				
				var callback = function(config) {
					var newHtml = component.GetEditFieldTemplate(config);
					
					if(newHtml!=''){
						var newItem = $(newHtml);
						item.replaceWith(newItem);
						var dataType = item.data("type");
						newItem.attr("data-type", dataType);
						newItem.attr("data-name", elName);
						newItem.attr('id',"ctrl_" + ctrlIndex++);
						if(config!=null){
							newItem.data("config", config);
						}
						configureNestedTables();
					}					
				}
				
				var fieldConfig = component.GetFieldConfiguration(null);
				if(fieldConfig!=null){
					$("#editForm .modal-body").html(fieldConfig.htmlForm);
					vm = new Vue({ el: '#editForm', data: fieldConfig.dataModel });
					
					$('#editForm').modal('show').on('hide.bs.modal', function () {    
						elName = $("#ctrlName").val();
						if(elName==""){
							$(evt.item).remove();
						}
						else{
							callback(vm.$data); //replace null with the result of the modal
						}
					})					
				}else {
					callback(null);
				}

				
				

			}
			
			
			
		  }
	});
}


function Save(){
	
	var surface = $("#designSurface");
	var node = {};
	node.id="123456789";
	node.name = "My first form";
	_createJsonNodes(surface, node);
	$("#code").val(JSON.stringify(node));
}

function _createJsonNodes(el, node){
	var snode = node;
	var jel = $(el);
	if(jel.data("type")){
		snode = {};
		$.each(jel.data(), function(i, e) {
		   snode[i] = e;
		});
		snode.id = jel.attr("id");
		
		if(node.components==null) node.components = [];
		node.components.push(snode)
	}
	
	var l = $(el).children();
	l.each(function( index ) {
		var sel = l[index];
		_createJsonNodes(sel,snode);
	});
}

	