var cf_grid = {
	type: "grid",
	toolBarItemContentHtml: "Grid",
	configDataModel: {
		numberColumns: 2,
		numberRows: 1
	},
	generateEditForm: function (config) {
		return '<div class="form-group"><Label>Columns</Label><Input v-model="numberColumns" class="form-control"></input></div><div class="form-group"><Label>Rows</Label><Input v-model="numberRows" class="form-control"></input></div>';
	},
	generateComponent: function (data, components, value, editMode = false) {
		var colSize = Math.floor(12 / data.numberColumns);
		var colsToCompensate = 12 - (colSize * data.numberColumns);
		var grid = $('<div class="list-group-item container"/>');
		var i = 0;
		for (var y = 0; y < data.numberRows; y++) {
			var row = $('<div class="row"/>');
			grid.append(row);
			for (var x = 0; x < data.numberColumns; x++) {
				var colW = colSize;

				if (x < colsToCompensate) colW++;
				var col = $('<div class="col list-group nested-sortable col-' + colW + '" data-width="' + colW + '" data-type="column" />');
				row.append(col);

				if (components != null && components.length > i) {
					var c = components[i];
					$.each(c.components, function (i, e) {
						BuildFormField(e, col);
					});
				}
				i++;
			}
		}
		return grid;
	}
};