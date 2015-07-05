function TableChartBuilder() {
	this.indicator = null;
	this.type = "Table";
};

// TableChartBuilder.prototype.build = function(indicator) {
// dataStoreService.getData(indicator).then(function(data) {
// $scope.tableChart = buildChart(data);
// });
// };

TableChartBuilder.prototype.build = function(result) {
	var cols = this.buildCols(result);
	var rows = this.buildRows(result);
	var chart = {
		"type" : 'Table',
		"displayed" : true,
		"data" : {
			"cols" : cols,
			"rows" : rows
		},
		"options" : {
			"width" : "100%",
			"height" : "100%",
			"pageSize" : "20",
			"page" : "enable",
			"showRowNumber" : false,
			"sort" : "enable"
		}
	};
	return chart;
};

TableChartBuilder.prototype.buildCols = function(result) {
	var cols = [ {
		"id" : "indicator",
		"label" : "Indicator",
		"type" : "string",
		"p" : {},
	} ];

	for (yr in result) {
		// Cols
		cols.push({
			"id" : "year-" + yr,
			"label" : yr,
			"type" : "number",
			"p" : {}
		});
	}
	return cols;
};

TableChartBuilder.prototype.buildRows = function(result) {
	var rows = [];
	var resultFirstKey = Object.keys(result)[0];
	var resultFirstValue = result[resultFirstKey];

	// Headers
	// Collect Keys
	var keys = [];
	var oldkeys = Object.keys(resultFirstValue);
	for (k in oldkeys) {
		if (isNaN(resultFirstValue[oldkeys[k]])) {
			var nestedKeys = Object.keys(resultFirstValue[oldkeys[k]]);
			for (k2 in nestedKeys) {
				keys.push(oldkeys[k] + ' ' + nestedKeys[k2]);
			}
		} else {
			keys.push(oldkeys[k]);
		}
	}

	// Collect headers
	for (k in keys) {
		rows.push({
			"c" : [ {
				"v" : keys[k]
			}, {
				"v" : 0
			}, {
				"v" : 0
			}, {
				"v" : 0
			}, {
				"v" : 0
			}, {
				"v" : 0
			}, ]
		});
	}

	var col = 1;

	var yearData;
	for (yr in result) {
		var row = 0;
		yearData = result[yr];
		yearDataKeys = Object.keys(yearData);
		for (k in yearDataKeys) {
			var val = null;
			if (isNaN(yearData[yearDataKeys[k]])) {
				var nestedKeys = Object.keys(yearData[yearDataKeys[k]]);
				for (k2 in nestedKeys) {
					rows[row]["c"][col]["v"] = yearData[yearDataKeys[k]][nestedKeys[k2]];					
					//$log.log("Row", row);
					//$log.log("Col", col);
					//$log.log("Data ", rows[row]["c"][col]["v"]);
					row++;
				}
			} else {
				// $log.log("Row", row);
				// $log.log("Rows", rows);
				rows[row]["c"][col]["v"] = yearData[yearDataKeys[k]];
				row++;
			}
		}
		col++;
	}
	return rows;
};