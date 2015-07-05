/**
 * New node file
 */
app.factory('qsrWoKCountriesColumnByPublications', function($http, $q, $log,
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

			var relKeys = indicatorFactory.getRelativeFilteredKeysForPath();

			var period = indicatorFactory.getPeriod();

			var cols = [ {
			  "id" : "country-id",
			  "label" : "Country",
			  "type" : "string",
			  "p" : {}
			}, {
			  "id" : 'publications-id',
			  "label" : 'Publications',
			  "type" : "number",
			  "p" : {}
			} ];

			var rows = _.map(relKeys, function(key) {
				return {
					"c" : [ {
						"v" : key[0]
					}, {
						"v" : _.reduce(period, function(sum, yr) {
							sum = sum + _data[key[0]][yr];
							return sum;
						}, 0)
					} ]
				};
			});

			var chart = {
			  "type" : 'ColumnChart',
			  "displayed" : true,
			  "data" : {
			    "cols" : cols,
			    "rows" : rows
			  },
			  "options" : {
			    "legend" : {
			      "position" : "top",
			      "maxLines" : "3",
			    },
			    "displayExactValues" : true,
			    "vAxis" : {
			      "title" : "Publications",
			      "gridlines" : {
				      "count" : 10
			      }
			    },
			    "hAxis" : {
				    "title" : "Country"
			    }
			  }
			};
			chartBuilt(chart);
		});
	}

	function rowValue(obj, key) {
		return key.reduce(function(prev, k, ind, arr) {
			return prev[k];
		}, obj);
	}

	return factory;

});