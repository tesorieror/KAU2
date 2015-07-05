app.factory('lineChartBuilderService', function($http, $q, $log) {

	var type = "LineChart";

	var data;
	var path;
	var filter;

	return {

	  setData : function(pData) {
		  data = pData;
	  },

	  setPath : function(pPath) {
		  path = pPath;
	  },

	  setFilter : function(pFilter) {
		  filter = pFilter;
	  },

	  buildChart : function() {
		  $log.info("[lineChartBuilderService.build] Building line chart");
		  // Build cols
		  var cols = buildCols();
		  // $log.log("[lineChartBuilderService.build] vCols", cols);
		  // Build rows
		  var rows = buildRows();
		  // $log.log("[lineChartBuilderService.build] vRows", rows);

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
		      "title" : buildTitle() + " " + buildSubtitle(),
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
		  // $log.log("Line Chart ", chart);
		  return chart;
	  }
	}

	function buildTitle() {
		return path[1].name + " " + path[0].name + " by " + path[2].name;
	}

	function buildSubtitle() {
		var keys = Object.keys(data);
		return "from " + keys[0] + " to " + keys[keys.length - 1];
	}

	function buildCols() {
		return filter.reduce(function(prev, curr, ind, arr) {
			prev.push({
			  "id" : curr + "ID",
			  "label" : curr,
			  "type" : "number",
			  "p" : {}
			});
			return prev;
		}, [ {
		  "id" : "year",
		  "label" : "Year",
		  "type" : "string",
		  "p" : {},
		} ]);
	}

	function getBasePath() {
		return path.reduce(function(prev, cat, ind, arr) {
			prev.push(cat.name);
			return prev;
		}, []).slice(2); // remove Students and Freshmen
	}

	function buildRows() {
		var years = Object.keys(data);
		// $log.log("[lineChartBuilderService.buildRows] years", years);
		// One col per year
		var base = getBasePath();
		return years.map(function(year, ind, arr) {
			// One key per filter
			var keys = filter.map(function(f, inf, arr) {
				var base = getBasePath();
				base.push(f);
				// $log.log("[lineChartBuilderService.buildRows] base", base);
				return [ year ].concat(base);
			});

			// $log.log("[lineChartBuilderService.buildRows] keys", keys);
			// One value per key + year
			var values = keys.reduce(function(result, key, ind, arr) {
				result.push({
					"v" : dataValue(key)
				});
				return result;
			}, [ {
				"v" : year
			} ]);
			// $log.log("[lineChartBuilderService.buildRows] values, year", values,
			// year);
			return {
				"c" : values
			};
		});

	}

	function dataValue(key) {
		return key.reduce(function(prev, k, ind, arr) {
			return prev[k];
		}, data);
	}

});