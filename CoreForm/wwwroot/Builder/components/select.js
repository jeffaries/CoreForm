class c_select extends component{
	constructor	(){
		super();
	}
	GetToolbar(){
		return "Dropdown list";
	}
	
	GetFieldConfiguration(config){
		return null;
	}
	
	GetEditFieldTemplate(config){
		return '<div class="form-group"><Label>List</Label><select readonly style="background-color:white" class="form-control"></select></div>';
	}
}