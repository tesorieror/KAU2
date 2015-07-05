app.controller("DataBarCtrl",
		function($http, $q, $log, $routeParams, $scope, dataStoreService) {

			$scope.hierarchicalFilter = null;

			$scope.accordionStatus = {
				filter : false,
				period : false
			};

			$scope.radioModel = 'Field';

			$scope.filter = {};

			$scope.indicator = new Indicator();
			$scope.indicator.setValuesFromArray($routeParams);
			$scope.period = {};

			$log.log("Route params", $routeParams);

			$q.all(
					[ dataStoreService.getYears(), dataStoreService.getDataBarGroups(),
							dataStoreService.getDataBarLegends() ]).then(
					function(results) {
						$scope.period = new Period(results[0]);
						$scope.groups = results[1];
						$scope.legends = results[2];

						angular.forEach($scope.legends[$scope.indicator.group],
								function(value, key) {
									$scope.filter[value] = true;
								});

						// $log.log("Indicator ", $scope.indicator);

						$scope.subcategories = $scope.groups[$scope.indicator.group];

						// $log.log('Groups ', $scope.groups);
						// $log.log('Legends ', $scope.legends);
						// $log.log('Subcategories ', $scope.subcategories);

						$scope.updateChart();

					});

			$scope.updateChart = function() {
				// $log.log('Filter ', $scope.filter);
				$scope.indicator.setPeriod($scope.period);
				dataStoreService.getData($scope.indicator).then(function(data) {
//					$log.log("Indicator ", $scope.indicator);
//					$log.log("Data ", data);
					$scope.barChart = buildChart(data);
					// $log.log("Bar Chart: ", $scope.barChart);
				});
			};

			function buildChart(result) {
				var cols = buildCols(result);
				var rows = buildRows(result);
				var resultKeys = Object.keys(result);
				var model = {
					"type" : 'ColumnChart',
					"displayed" : true,
					"data" : {
						"cols" : cols,
						"rows" : rows
					},
					"options" : {
						// 'legend' : 'bottom',
						"width" : "100%",
						"height" : "400px",
						"isStacked" : true,
						"backgroundColor" : "transparent",
						"titlePosition" : "none",
						"title" : $scope.indicator.group + " "
								+ $scope.indicator.subcategory + " students" + " from "
								+ resultKeys[resultKeys.length - 1] + " to " + resultKeys[0],
					// chartArea : {
					// width : "100%",
					// height : "50%"
					// },
					}
				};
				return model;
			}

			function buildCols(result) {
				var cols = [ {
					"id" : "year",
					"label" : "Year",
					"type" : "string",
					"p" : {},
				} ];

				angular.forEach($scope.subcategories, function(value, key) {
					var val = $scope.legends[$scope.indicator.group][key];
					// $log.log("VAL: ", val);

					if ($scope.filter[$scope.legends[$scope.indicator.group][key]])
						cols.push({
							"id" : val + "ID",
							"label" : val,
							"type" : "number",
							"p" : {},
						});
				});

				// $log.log("Cols ", cols);

				return cols;
			}

			function buildRows(result) {
				var rows = [];
				var yrs = Object.keys(result).reverse();
				for (yrk in yrs) {
					var yr = yrs[yrk];
					var row = [ {
						"v" : yr
					} ];
					angular.forEach($scope.subcategories, function(value, key) {
						var val = result[yr];
						// Group accessor
						angular.forEach(value, function(v, k) {
							val = val[v];
						});

						// $log.log("Filter ",
						// $scope.filter[$scope.legends[$scope.indicator.group][key]]);
						// $log.log("K ", key);
						// $log.log("V ", value);
						if ($scope.filter[$scope.legends[$scope.indicator.group][key]])
							row.push({
								"v" : val
							});
					});

					rows.push({
						"c" : row
					});
				}

				//$log.log("Rows ", rows);

				return rows;
			}

		});