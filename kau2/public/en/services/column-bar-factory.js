/**
 * New node file
 */
app.factory('columnBarFactory', function($http, $q, $log, indicatorFactory,
    dataStoreService) {

	var factory = {};

	var _data = null;

	/**
	 * Public functions
	 */

	factory.build = function(chartBuilt) {
		buildChart(chartBuilt);
	};

	/**
	 * Private functions
	 */

	function loadData(dataLoaded) {
		indicatorFactory.getDataForYears(function(data) {
			_data = data;
			dataLoaded(data);
		});
	}

	function buildChart(chartBuilt) {
		loadData(function(data) {
			var chart = null;
			var keys = indicatorFactory.getFilteredKeysForPath();
			var chart = {
			  "type" : 'ColumnChart',
			  "displayed" : true,
			  "data" : {
			    "cols" : buildCols(keys),
			    "rows" : buildRows(keys)
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
			chartBuilt(chart);
		});
	}

	function buildCols(keys) {
		var result;
		result = keys.reduce(function(prev, curr, ind, arr) {
			prev.push({
			  "id" : curr[1] + "ID",
			  "label" : curr[indicatorFactory.getStringPathArray().length],
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
		return result;
	}

	function buildRows(keys) {
		return indicatorFactory.getPeriod().map(function(year, ind, arr) {
			return {
				"c" : keys.reduce(function(prev, key, ind, arr) {
					prev.push({
						"v" : rowValue(_data[year], key)
					});
					return prev;
				}, [ {
					"v" : year
				} ])
			}
		});
	}

	function rowValue(obj, key) {
		key = key.slice(3, key.length);// Path to use relative path
		return key.reduce(function(prev, k, ind, arr) {
			return prev[k];
		}, obj);
	}

	function buildTitle() {
		return _.reduce(indicatorFactory.getStringPathArray().slice(0).reverse(),
		    function(title, pathElement) {
			    return title.concat(pathElement.firstToUpper());
		    }, '');
	}

	function buildSubtitle() {
		return "from " + indicatorFactory.getFrom() + " to "
		    + indicatorFactory.getTo();
	}

	return factory;
});