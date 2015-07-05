/**
 * New node file
 */

app.controller('DataDescriptorCtrl', function($scope, $log, $q, $modalInstance,
    dataStoreService, path) {

	// Title
	$scope.title = _.reduceRight(path, function(acc, curr) {
		return acc + curr.firstToUpper() + ' ';
	}, "");

	// Chart types
	$scope.chartTypes = [ {
	  label : "Table",
	  id : "Table",
	  draw : buildTable
	}, {
	  label : "Column",
	  id : "ColumnChart",
	  draw : buildColumnChart
	}, {
	  label : "Line",
	  id : "LineChart",
	  draw : buildLineChart
	}, {
	  label : "Pie",
	  id : "PieChart",
	  draw : buildPieChart
	} ];

	$scope.chartType = $scope.chartTypes[0];

	$scope.unavailable = false;

	// Data
	var years;
	var descriptions;

	$q.all(

	    [ dataStoreService.getYears(path),
	        dataStoreService.getDescriptionForPath(path) ]).then(
	    function(results) {
		    years = results[0];
		    descriptions = results[1];
		    initialize();
	    });

	/**
	 * Initialization
	 */
	function initialize() {
		// Period
		$scope.years = years;
		$scope.from = _.last(years);
		$scope.to = _.first(years);

		try {
			// Description
			var desc = descriptions[path[3]][path[4]];
			if (path[5])
				desc = desc[path[5]];
			$scope.description = desc;
			$log.log("Description", $scope.description);

			// Title
			$scope.title = $scope.description.title;
			$scope.chartRefresh();
		} catch (err) {
			$scope.unavailable = true;
		}
	}

	/**
	 * Period
	 */

	$scope.periodChanged = function() {
		$scope.chartRefresh();
	}

	function getPeriod() {
		var s = $scope.years.indexOf($scope.to);
		var e = $scope.years.indexOf($scope.from);
		return $scope.years.slice(s, e + 1);
	}

	/**
	 * Chart refresh
	 */

	$scope.chartRefresh = function() {
		var period = getPeriod();

		$q.all(_.map(period, function(year) {

			return dataStoreService.getDataForPathAndYear(path.slice(0,3), year);

			// return dataStoreService.getDataForPath(path.concat(year));

		})).then(function(results) {
			var data = _.reduce(period, function(data, year) {
				data[year] = results[period.indexOf(year)];
				return data;
			}, []);
			$log.log("Data", data);
			$scope.chartObject = $scope.chartType.draw(data);
			$log.log("Chart Object", $scope.chartObject);
		});
	}

	/**
	 * Column Chart
	 */

	function buildColumnChart(data) {

		var rows = [];
		var actual = -1;
		var last = -1;
		var total = 0;

		var period = Object.keys(data).reverse();
		$log.log(period);
		var to = _.last(period);
		var from = _.first(period);
		$log.log("From", from, "To", to);

		period.forEach(function(yr) {
			var value = data[yr];
			if (yr >= from && yr <= to) {
				val = value[path[3]][path[4]];
				if (path[5])
					val = val[path[5]];
				total = total + val;
			}
		});

		period.forEach(function(yr) {
			var value = data[yr];
			if (yr >= from && yr <= to) {
				last = actual;

				actual = value[path[3]][path[4]];
				if (path[5])
					actual = actual[path[5]];

				var growth = (actual / total) * 100;

				rows.push({
					"c" : [ {
						"v" : yr
					}, {
						"v" : actual
					}, {
						"v" : growth
					} ]
				});
			}
		});

		// $log.log("Rows", rows);

		return {
		  "type" : 'ColumnChart',
		  "displayed" : true,
		  "data" : {
		    "cols" : [ {
		      "id" : "year",
		      "label" : "Year",
		      "type" : "string",
		      "p" : {}
		    }, {
		      "id" : "value-id",
		      "label" : "Freshmen",
		      "type" : "number",
		      "p" : {}
		    }, {
		      "type" : "number",
		      "role" : "annotation"
		    } ],
		    "rows" : rows
		  },
		  "options" : {
		    "title" : $scope.description.title,
		    "legend" : {
			    "position" : "bottom"
		    },
		    "isStacked" : "true",
		    "fill" : 20,
		    "displayExactValues" : true,
		    "vAxis" : {
		      "title" : "Students",
		      "gridlines" : {
			      "count" : 10
		      }
		    },
		    "hAxis" : {
			    "title" : "Year"
		    }
		  },
		  "formatters" : {
			  "number" : [ {
			    "columnNum" : 2,
			    "suffix" : "%",
			    "fractionDigits" : 2
			  } ]
		  }
		};

	}

	/**
	 * Line chart
	 */

	function buildLineChart(data) {
		var chData = buildColumnChart(data);
		chData['type'] = 'LineChart';
		return chData;
	}

	/**
	 * Pie chart
	 */

	function buildPieChart(data) {
		var chData = buildColumnChart(data);
		chData["options"]["legend"]["position"] = "right";
		chData['type'] = 'PieChart';
		return chData;
	}

	/**
	 * Table chart
	 */

	function buildTable(data) {
		var rows = [];
		var actual = -1;
		var last = -1;

		var period = Object.keys(data).reverse();
		// $log.log(period);

		period.forEach(function(yr) {
			var value = data[yr];
			if (yr >= _.first(period) && yr <= _.last(period)) {
				last = actual;
				actual = value[path[3]][path[4]];
				if (path[5])
					actual = actual[path[5]];
				var growth = (last == -1) ? 0 : (actual / last - 1) * 100;
				rows.push({
					"c" : [ {
						"v" : yr
					}, {
						"v" : actual
					}, {
						"v" : growth
					} ]
				});
			}
		});

		rows = rows.reverse();
		return {
		  "type" : 'Table',
		  "displayed" : true,
		  "data" : {
		    "cols" : [ {
		      "id" : "year",
		      "label" : "Year",
		      "type" : "string",
		      "p" : {}
		    }, {
		      "id" : "value-id",
		      "label" : "Value",
		      "type" : "number",
		      "p" : {}
		    }, {
		      "id" : "growth-id",
		      "label" : "Growth rate",
		      "type" : "number",
		      "p" : {}
		    } ],
		    "rows" : rows
		  },
		  "options" : {
		    "width" : "100%",
		    "title" : $scope.description.title,
		    "legend" : {
			    "position" : "bottom"
		    },
		    "isStacked" : "true",
		    "fill" : 20,
		    "displayExactValues" : true,
		    "vAxis" : {
		      "title" : "Students",
		      "gridlines" : {
			      "count" : 10
		      }
		    },
		    "hAxis" : {
			    "title" : "Year"
		    }
		  },
		  "formatters" : {
		    "number" : [ {
		      "columnNum" : 2,
		      "suffix" : "%",
		      "fractionDigits" : 2
		    } ],
		    "arrow" : [ {
		      "columnNum" : 2,
		      "suffix" : "%",
		      "fractionDigits" : 2,
		      "base" : 0
		    } ]
		  }
		};
	}

	/**
	 * Dialog controls
	 */

	$scope.ok = function() {
		$modalInstance.close(path);
	};

	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	$scope.close = function() {
		$modalInstance.close();
	};

});
