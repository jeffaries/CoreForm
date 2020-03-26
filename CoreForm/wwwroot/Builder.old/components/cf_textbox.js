var cf_textbox = {
		type : "textbox",		
		toolBarItemContentHtml : "Textbox",
		configDataModel : {
				label : "Hello",
				placeHolder : "Write text here",
				isRequired : true,
				description : "This is the description text"
		},
		generateEditForm : function(config){
			return '<div class="form-group"><Label>Label</Label><Input v-model="label" class="form-control"></input><Label>Placeholder</Label><Input v-model="placeHolder" class="form-control"></input><Label>Description</Label><Input v-model="description" class="form-control"></input></div>';
		},
		generateComponent :  function(data, components, value, editMode = false) {
			return '<div class="form-group"><Label>' + ((data != undefined) ? data.label : "[No Label]") +'</Label><Input readonly style="background-color:white" class="form-control"></input></div>';
		}
	};