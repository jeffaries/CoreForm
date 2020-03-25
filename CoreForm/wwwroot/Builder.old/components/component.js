class component{
	constructor	(){
	}
	GetToolbar(){
		return "Unknown";
	}
	
	// return null -> no configuration form shown
	GetFieldConfiguration(config){
		return null;
	}
	
	GetEditFieldTemplate(config){
		return 'ERROR - No template';
	}
}


// class FieldConfigurationModel{
	// var dataModel = {};
	// var htmlForm = "";
	// var validationCallback = function(config) {};
// }