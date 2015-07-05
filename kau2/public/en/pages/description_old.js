/**
 * New node file
 */

app
    .controller(
        'DescriptionCtrl',
        function($scope, $http, $q, $log, $routeParams, dataStoreService,
            $window) {

	        $log.log("Route Params",$routeParams);

	        // Indicator
	        $scope.indicator = new Indicator();
	        $scope.indicator.setValuesFromArray($routeParams);

	        // Years
	        var years = [];
	        $scope.fromYears;
	        $scope.toYears;

	        // Display types
	        $scope.displayTypes = [ 'Table', 'ColumnChart', 'LineChart',
	            "PieChart" ];
	        $scope.displayType = $scope.displayTypes[0];

	        // Chart object
	        this.chartObject = {};
	        $scope.data = [];

	        /**
					 * Initialization
					 */
	        dataStoreService.getYears().then(function(result) {
		        years = result;
		        $scope.fromYears = years.slice();
		        $scope.toYears = years.slice();
		        $scope.indicator.toYear = $scope.fromYears[0];
		        $scope.indicator.fromYear = $scope.toYears[years.length - 1];
		        $scope.update();
	        });

	        dataStoreService
	            .getDescriptionFor($scope.indicator)
	            .then(
	                function(result) {
		                $scope.description = result[$scope.indicator.subsubcategory][$scope.indicator.filter];
		                // Title
		                $scope.title = $scope.description.title;
	                });

	        /**
					 * Data update
					 */

	        $scope.update = function() {
		        var from = years.indexOf($scope.indicator.fromYear);
		        var to = years.indexOf($scope.indicator.toYear);
		        $scope.indicator.years = years.slice(to, from + 1);

		        dataStoreService.getData($scope.indicator).then(function(result) {
			        $scope.data = result;
			        $scope.chartObject = chartBuilder[$scope.displayType]();
			        $log.log('Update Data: ', $scope.data);
		        });
	        }

	        /**
					 * Chart builder
					 */

	        var chartBuilder = {};

	        chartBuilder[$scope.displayTypes[0]] = buildTable;
	        chartBuilder[$scope.displayTypes[1]] = buildColumnChart;
	        chartBuilder[$scope.displayTypes[2]] = buildLineChart;
	        chartBuilder[$scope.displayTypes[3]] = buildPieChart;

	        function buildColumnChart() {
		        var rows = [];
		        var actual = -1;
		        var last = -1;
		        var total = 0;
		        for (yr in $scope.data) {
			        var value = $scope.data[yr];
			        if (yr >= $scope.indicator.fromYear
			            && yr <= $scope.indicator.toYear) {
				        var val = value[$scope.indicator.subsubcategory][$scope.indicator.filter];
				        total = total + val;
			        }
		        }

		        for (yr in $scope.data) {
			        var value = $scope.data[yr];
			        if (yr >= $scope.indicator.fromYear
			            && yr <= $scope.indicator.toYear) {
				        last = actual;
				        actual = value[$scope.indicator.subsubcategory][$scope.indicator.filter];
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
		        }

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

	        function buildLineChart() {
		        var chData = buildColumnChart();
		        chData['type'] = 'LineChart';
		        return chData;
	        }

	        function buildPieChart() {
		        var chData = buildColumnChart();
		        chData["options"]["legend"]["position"] = "right";
		        chData['type'] = 'PieChart';
		        return chData;
	        }

	        function buildTable() {
		        var rows = [];
		        var actual = -1;
		        var last = -1;

		        for (yr in $scope.data) {
			        var value = $scope.data[yr];

			        if (yr >= $scope.indicator.fromYear
			            && yr <= $scope.indicator.toYear) {
				        last = actual;
				        actual = value[$scope.indicator.subsubcategory][$scope.indicator.filter];
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
		        }

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
			          } ]
		          }
		        };
	        }

	        /**
					 * Back button
					 */
	        $scope.back = function() {
		        $window.history.back();
	        }

        });
