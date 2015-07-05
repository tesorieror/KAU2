app.factory('columnChartBuilderService', function($http, $q, $log) {

	var type = "ColumnChart";

	return {
		build : function(result, categoryPath, filter) {
//			$log.log(this.filter);
			var cols = buildCols(result, categoryPath[categoryPath.length - 1].name,
			    filter);

			var rows = buildRows(result, categoryPath[categoryPath.length - 1].name,
			    filter);
			
			var chart = {
			  "type" : type,
			  "displayed" : true,
			  "data" : {
			    "cols" : cols,
			    "rows" : rows
			  },
			  "options" : {
			    "isStacked" : true,
			    "backgroundColor" : "transparent",
			    "chartArea" : {
			      "left" : "100",
			      "top" : "20",
			      "height" : "350"
			    },
			    "titlePosition" : "none",
			    "title" : buildTitle(result, categoryPath) + " "
			        + buildSubtitle(result),
			    "legend" : {
			      "position" : "right",
			      "maxLines" : "3",
			      "textStyle" : {
				      "fontSize" : "11"
			      },
			    },
			    "vAxis" : {
				    "title" : "Students"
			    },
			    "hAxis" : {
				    "title" : "Years"
			    }
			  }
			};
			// $log.log("Column Chart ", chart);
			return chart;
		}
	}

	function buildTitle(result, categoryPath) {
		return categoryPath[1].name + " " + categoryPath[0].name + " by "
		    + categoryPath[2].name;
	}

	function buildSubtitle(result) {
		var keys = Object.keys(result);
		return "from " + keys[0] + " to " + keys[keys.length - 1];
	}

	function buildCols(result, base, filter) {
		// Collect years
		var years = Object.keys(result);
		// Collect metadata
		var keys = rowKeys(result[years[0]][base], base, filter).map(
		    function(curr, ind, arr) {
			    return curr[1];
		    });

		return keys.reduce(function(prev, curr, ind, arr) {
			prev.push({
			  "id" : curr + "ID",
			  "label" : curr,
			  "type" : "number",
			  "p" : {}
			});
			return prev;
		}, [ {
		  "id" : "indicator",
		  "label" : "Indicator",
		  "type" : "string",
		  "p" : {},
		} ]);
	}

	function buildRows(result, base, filter) {
		// Collect years
		var years = Object.keys(result);
		// Collect metadata
		var keys = rowKeys(result[years[0]][base], base, filter);
		// $log.log("buildRows keys", keys);
		return years.map(function(year, ind, arr) {
			return {
				"c" : keys.reduce(function(prev, key, ind, arr) {
					prev.push({
						"v" : rowValue(result[year], key)
					});
					return prev;
				}, [ {
					"v" : year
				} ])
			}
		});
	}

	function rowKeys(obj, base, filter) {
		// $log.log("rowKeys obj", obj);
		var keys = Object.keys(obj);
		keys = keys.reduce(function(prev, key, ind, arr) {
			if (!isNaN(obj[key]))
				if (key != "Total")
					prev.push([ base, key ]);
				else
					;
			else
				prev.push([ base, key, "Total" ]);
			return prev;
		}, []);

//		$log.log("Filter", filter);

		keys = keys.filter(function(curr, ind, arr) {
			return filter.indexOf(curr[1]) > -1;
		}); // Filter Data

//		$log.log("Keys", keys);
		return keys;
	}

	function rowValue(obj, key) {
		return key.reduce(function(prev, k, ind, arr) {
			return prev[k];
		}, obj);
	}

});