app
		.controller(
				"DataLineCtrl",
				function($http, $q, $log, $routeParams, $scope, dataStoreService) {

					// $scope.chart = null;

					$scope.accordionStatus = {
						category : false,
						subcategory : false,
						group : false,
						subsubcategory : false,
						filter : false,
						period : false
					};

					$scope.selected = [];
					$scope.indicator = new Indicator();

					$q
							.all(
									[ dataStoreService.getYears(),
											dataStoreService.getDataMetadata() ]).then(
									function(results) {
										$scope.period = $scope.period = new Period(results[0]);
										$scope.data = results[1];
										initialize();
									});

					function initialize() {
						$scope.selected[0] = $scope.data
								.filter(function(elem, index, array) {
									return elem.name == $routeParams.category;
								})[0];
						$scope.selected[1] = $scope.selected[0].children
								.filter(function(elem, index, array) {
									return elem.name == $routeParams.subcategory;
								})[0];
						$scope.selected[2] = $scope.selected[1].children
								.filter(function(elem, index, array) {
									return elem.name == $routeParams.group;
								})[0];
						$scope.selected[3] = $scope.selected[2].children
								.filter(function(elem, index, array) {
									return elem.name == $routeParams.subsubcategory;
								})[0];
						$scope.selected[4] = $scope.selected[3].children
								.filter(function(elem, index, array) {
									return elem.name == $routeParams.filter;
								})[0];

						$scope.categoryChanged();
						$scope.periodChanged();
					}

					$scope.categoryChanged = function() {
						$log.log("Category changed");
						if ($scope.selected[0]) {
							$scope.selected[1] = $scope.selected[0].children[0];
							$scope.subcategoryChanged();
						} else {
							$scope.indicator.category = null;
							$scope.selected[1] = null;
						}
					}

					$scope.subcategoryChanged = function() {
						$log.log("Subcategory changed");
						if ($scope.selected[1]) {
							$scope.selected[2] = $scope.selected[1].children[0];
							$scope.groupChanged();
						} else {
							$scope.indicator.subcategory = null;
							$scope.selected[2] = null;
						}
					}

					$scope.groupChanged = function() {
						$log.log("Group changed");
						if ($scope.selected[2]) {
							$scope.selected[3] = $scope.selected[2].children[0];
							$scope.subsubcategoryChanged()
						} else {
							$scope.indicator.group = null;
							$scope.selected[3] = null;

						}
					}

					$scope.subsubcategoryChanged = function() {
						$log.log("Subsubcategory changed");
						if ($scope.selected[3]) {
							$scope.selected[4] = $scope.selected[3].children[0];
							$scope.filterChanged();
						} else {
							$scope.indicator.subsubcategory = null;
							$scope.selected[4] = null;
						}
					}

					$scope.filterChanged = function() {
						$log.log("Filter changed");
						$scope.updateChart();
					}
					$scope.periodChanged = function() {
						$log.log("Period changed");
						$scope.updateChart();
					}

					$scope.updateChart = function() {
						$log.log('Update chart');
						// Update Indicator
						$scope.indicator.category = $scope.selected[0] ? $scope.selected[0].name
								: null;
						$scope.indicator.subcategory = $scope.selected[1] ? $scope.selected[1].name
								: null;
						$scope.indicator.group = $scope.selected[2] ? $scope.selected[2].name
								: null;
						$scope.indicator.subsubcategory = $scope.selected[3] ? $scope.selected[3].name
								: null;
						$scope.indicator.filter = $scope.selected[4];
						$scope.indicator.years = $scope.period.getPeriod();

						// Retrieve Data
						dataStoreService.getData($scope.indicator).then(function(data) {
							$log.log("Indicator ", $scope.indicator);
							$log.log("Data ", data);
							$scope.chart = buildChart(data);
							// $log.log("Bar Chart: ", $scope.barChart);
						});
					}

					function buildChart(result) {
						var cols = buildCols(result);
						var rows = buildRows(result);
						var resultKeys = Object.keys(result);
						var model = {
							"type" : 'LineChart',
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
										+ resultKeys[resultKeys.length - 1] + " to "
										+ resultKeys[0],
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

						// $log.log("Rows ", rows);

						return rows;
					}

				});