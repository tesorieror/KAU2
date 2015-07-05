/**
 * New node file
 */

app.controller('SubsubcategoryCtrl', function($scope, $log, $location, $q,
    $route, $filter, $location, dataStoreService) {
	$log.info("Loading Subsubcategory Controller");
	$log.log("Params", $route.current.params);

	// Navigation active item
	$scope.activePath = $location.path();

	var metadata;
	var years;
	var path = $location.path();

	var rootPathName = path.split("/")[1];
	var categoryName = $route.current.params.category;
	var subcategoryName = $route.current.params.subcategory;
	var subsubcategoryName = $route.current.params.subsubcategory;

	// Export category names

	$scope.rootPathName = rootPathName;
	$scope.categoryName = categoryName;
	$scope.subcategoryName = subcategoryName;
	$scope.subsubcategoryName = subsubcategoryName;

	$log.info("Loading Column Bar Data Controller");

	$q.all(
	    [
	        dataStoreService.getMetadata(rootPathName),
	        dataStoreService.getYears([ rootPathName, categoryName,
	            subcategoryName, subsubcategoryName ]) ]).then(function(result) {
		metadata = result[0];
		years = result[1];
		initialize();
	});

	function initialize() {
		// Title
		$scope.title = subcategoryName.firstToUpper() + " "
		    + categoryName.firstToUpper() + " " + rootPathName.firstToUpper()
		    + " by " + subsubcategoryName.firstToUpper();

		// Category
		$scope.category = _.detect(metadata, function(cat) {
			return cat.name.toUpperCase() == categoryName.toUpperCase();
		});
		// Subcategory
		$scope.subcategory = _.detect($scope.category.children, function(cat) {
			return cat.name.toUpperCase() == subcategoryName.toUpperCase();
		});
		// Subsubcategory
		$scope.subsubcategory = _.detect($scope.subcategory.children,
		    function(cat) {
			    return cat.name.toUpperCase() == subsubcategoryName.toUpperCase();
		    });

		// Subsubsubcategory
		$scope.subcategoryNames = _.map($scope.category.children, function(cat) {
			return cat.name;
		});

		// Subsubsubcategory
		$scope.subsubcategoryNames = _.map($scope.subcategory.children, function(
		    cat) {
			return cat.name;
		});

		$log.log("ActivePath", $scope.activePath);
		$log.log('/' + $scope.rootPathName + '/category/' + $scope.categoryName
		    + '/subcategory/' + $scope.subcategoryName + '/subsubcategory/');

		// Period
		$scope.years = years;
		$scope.from = _.last(years);
		$scope.to = _.first(years);
		// $scope.period = years;

		// Chart Type
		$scope.chartType = [ {
		  name : "Columns",
		  id : "ColumnChart"
		}, {
		  name : "Lines",
		  id : "LineChart"
		} ]
		$scope.selectedChartType = $scope.chartType[0];

		$scope.chartTypeChanged = function() {
			// Refresh
			$scope.chartRefresh();
		}

		// Filter
		$scope.filter = _.reduce($scope.subsubcategory.children, function(filter,
		    cat) {
			filter[cat.name] = true;
			return filter;
		}, []);

		// Refresh
		$scope.chartRefresh();
	}

	// Period
	$scope.periodChanged = function() {
		// $scope.period = getPeriod();
		$scope.chartRefresh();
	}

	function getPeriod() {
		var s = $scope.years.indexOf($scope.to);
		var e = $scope.years.indexOf($scope.from);
		return $scope.years.slice(s, e + 1);
	}

	// Navigation

	$scope.subsubsubcategoryClicked = function(subcat) {
		$log.log(subcat);
	}

	$scope.goToParent = function() {
		var path = "/" + rootPathName.toLowerCase() + "/category/"
		    + categoryName.toLowerCase() + "/subcategory/"
		    + subcategoryName.toLowerCase();
		$log.log(path);
		$location.path(path);
	}

	// Chart
	$scope.chart;

	// Refresh chart
	$scope.chartRefresh = function() {
		var period = getPeriod();
		$log.log("Chart refresh");
		$q.all(
		    _.map(period, function(year) {
			    return dataStoreService.getDataForYear([ categoryName,
			        subcategoryName ], year);
		    })).then(function(results) {
			$log.log("Results", results);
			$log.log("Build period", period);
			var data = _.reduce(period, function(res, year) {
				res[year] = results[period.indexOf(year)];
				return res;
			}, []);
			$log.log("Data", data);
			var type = $scope.selectedChartType.id;
			var filter = $scope.filter;
			var chart = build(type, data, filter, period);
			$scope.chart = chart;
		});
	}

	// Column Bar

	function build(type, data, filter, period) {

		var keys = buildKeys(metadata, filter);
		var chart = {
		  "type" : type,
		  "displayed" : true,
		  "data" : {
		    "cols" : buildCols(keys),
		    "rows" : buildRows(keys, data, period)
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
		    "title" : buildTitle() + " " + buildSubtitle(period),
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

	function buildTitle() {
		return $scope.subcategory.name.firstToUpper() + " "
		    + $scope.category.name.firstToUpper() + " by "
		    + $scope.subsubcategory.name.firstToUpper();
	}

	function buildSubtitle(period) {
		return "from " + _.last(period) + " to " + _.first(period);
	}

	function buildKeys(metadata, filter) {
		var result;
		var cat = $scope.subsubcategory;

		// Subsubsubcotegory names
		result = _.map(cat.children, function(subcat) {
			return subcat.name
		});

		// Subsubcategory key
		result = _.map(result, function(name) {
			var subcat = _.detect(cat.children, function(c) {
				return c.name == name;
			});
			if (subcat.children.length == 0)
				return [ cat.name, name ];
			else
				return [ cat.name, name, 'Total' ];
		});

		// Filter
		result = result.filter(function(curr, ind, arr) {
			return filter[curr[1]];
		});
		return result;
	}

	function buildCols(keys) {
		var result;
		result = keys.reduce(function(prev, curr, ind, arr) {
			prev.push({
			  "id" : curr[1] + "ID",
			  "label" : curr[1],
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

	function buildRows(keys, data, period) {
		return period.map(function(year, ind, arr) {
			return {
				"c" : keys.reduce(function(prev, key, ind, arr) {
					prev.push({
						"v" : rowValue(data[year], key)
					});
					return prev;
				}, [ {
					"v" : year
				} ])
			}
		});
	}

	function rowValue(obj, key) {
		return key.reduce(function(prev, k, ind, arr) {
			return prev[k];
		}, obj);
	}
});