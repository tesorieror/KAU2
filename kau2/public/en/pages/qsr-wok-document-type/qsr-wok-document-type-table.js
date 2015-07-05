/**
 * New node file
 */
app.factory('qsrWoKDocumentTypeTable', function($http, $q, $log,
    indicatorFactory, dataStoreService) {

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
		indicatorFactory.getPathData(function(data) {
			_data = data;
			dataLoaded(data);
		});
	}

	function buildChart(chartBuilt) {
		loadData(function(data) {
			var chart = null;
			var chart = {
			  "type" : 'Table',
			  "displayed" : true,
			  "data" : {
			    "cols" : buildCols(),
			    "rows" : buildRows()
			  },
			  "options" : {
			    "width" : "100%",
			    "height" : "450",
			    "pageSize" : "10",
			    "page" : "enable",
			    "showRowNumber" : false,
			    "sort" : "enable"
			  },
			  "formatters" : {
				  "number" : [ {
				    "columnNum" : 2,
				    "suffix" : "%",
				    "fractionDigits" : 2
				  } ]
			  }
			};
			chartBuilt(chart);
		});
	}

	function buildCols() {
		var result = _.reduce(indicatorFactory.getPeriod(), function(cols, yr) {
			cols.push({
			  "id" : "year-" + yr,
			  "label" : yr,
			  "type" : "number",
			  "p" : {}
			});
			return cols;
		}, [ {
		  "id" : "indicator",
		  "label" : "Indicator",
		  "type" : "string",
		  "p" : {},
		}, {
		  "id" : "overall",
		  "label" : "Over All",
		  "type" : "number",
		  "p" : {},
		}, {
		  "id" : "percentage",
		  "label" : "%",
		  "type" : "number",
		  "p" : {},
		} ]);

		return result;
	}

	function buildRows() {
		
		var relKeys = indicatorFactory.getRelativeFilteredKeysForPath();

		var total = 0;
		var ref = _.reduce(indicatorFactory.getPeriod(), function(sum, yr) {
			return sum + rowValue(_data, [ 'Documents' ])[yr];
		}, 0)

		return _.map(relKeys, function(key) {
			return {
				"c" : _.reduce(indicatorFactory.getPeriod(), function(prev, year) {
					prev.push({
						"v" : rowValue(_data, key)[year]
					});
					return prev;
				}, [
				    {
					    "v" : _.last(key)
				    },
				    {
					    "v" : total = _.reduce(indicatorFactory.getPeriod(), function(
					        sum, yr) {
						    return sum + rowValue(_data, key)[yr];
					    }, 0)
				    }, {
					    "v" : (total / ref)*100
				    } ])
			};
		});
	}

	function rowValue(obj, key) {
		return key.reduce(function(prev, k, ind, arr) {
			return prev[k];
		}, obj);
	}

	return factory;

});