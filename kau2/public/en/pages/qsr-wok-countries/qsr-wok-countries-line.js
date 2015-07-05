/**
 * New node file
 */
app.factory('qsrWoKCountriesLine', function($http, $q, $log, indicatorFactory,
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
		indicatorFactory.getPathData(function(data) {
			_data = data;
			dataLoaded(data);
		});
	}

	function buildChart(chartBuilt) {
		loadData(function(data) {

			var relKeys = indicatorFactory.getRelativeFilteredKeysForPath();

			var period = indicatorFactory.getPeriod();

			var cols = _.reduce(relKeys, function(res, key) {
				res.push({
				  "id" : key[0].concat('-id'),
				  "label" : key[0],
				  "type" : "number",
				  "p" : {}
				});
				return res;
			}, [ {
			  "id" : "year",
			  "label" : "Year",
			  "type" : "string",
			  "p" : {}
			} ]);

			var rows = _.map(period.slice(0).reverse(), function(yr) {
				var values = _.reduce(relKeys, function(col, key) {
					col.push({
						"v" : rowValue(_data, key)[yr]
					});
					return col;
				}, [ {
					"v" : yr
				} ])

				return {
					"c" : values
				};
			});

			var chart = {
			  "type" : 'LineChart',
			  "displayed" : true,
			  "data" : {
			    "cols" : cols,
			    "rows" : rows
			  },
			  "options" : {
			    "width" : "700px",
			    "height" : "450px",
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
				    "title" : "Year"
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