class c_textbox extends component{
	constructor	(){
		super();
	}
	GetToolbar(){
		return "Textbox";
	}
	
	GetFieldConfiguration(config){
		return {
			dataModel : {
				label : "Hello",
				placeHolder : "Write text here",
				isRequired : true,
				description : "This is the description text"
			},
			htmlForm : '<div class="form-group"><Label>Label</Label><Input v-model="label" class="form-control"></input><Label>Placeholder</Label><Input v-model="placeHolder" class="form-control"></input><Label>Description</Label><Input v-model="description" class="form-control"></input></div>'
		}
	}
	
	GetEditFieldTemplate(config){
		return '<div class="form-group"><Label>' + config.label + '</Label><Input readonly style="background-color:white" class="form-control"></input></div>';
	}
}