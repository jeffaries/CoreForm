class c_table extends component{
	constructor	(){
		super();
	}
	GetToolbar(){
		return "Grid";
	}
	
	GetFieldConfiguration(config){
		return null;
	}
	
	GetEditFieldTemplate(valueObject){
		return '<div class="list-group-item container"><div class="row"><div class="col list-group nested-sortable" data-type="column"/><div class="col list-group nested-sortable" data-type="column"/></div></div>';
	}
}