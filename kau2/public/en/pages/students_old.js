app.controller("StudentsCtrl", function($http, $q, $log, $routeParams, $scope,
    $modal, $timeout, dataStoreService, categoryService, periodService,
    $filter, tableChartBuilderService, columnChartBuilderService,
    lineChartBuilderService) {
	// $log.info("Students controller running...");

	/**
	 * Initialize chart builders
	 */
	$scope.chartBuilders = [];
	$scope.chartBuilders[0] = tableChartBuilderService;
	$scope.chartBuilders[1] = columnChartBuilderService;
	$scope.chartBuilders[2] = lineChartBuilderService;
	$scope.chartBuilders[3] = tableChartBuilderService;

	$scope.chartBuilders[1].type = "Column";
	$scope.chartBuilders[2].type = "Line";
	$scope.chartBuilders[3].type = "Pie";

	$scope.builder = $scope.chartBuilders[0];

	/**
	 * Search string
	 */

	$scope.searchString = '';

	/**
	 * Chart model
	 */
	$scope.chart = {
	  "type" : "Table",
	  "data" : [],
	  "keys" : []
	};

	/**
	 * Chart Wrapper
	 */

	var chw = null;

	/**
	 * Period
	 */
	$scope.period = {};

	/**
	 * Data title
	 */

	$scope.dataTitle = "Data";

	/**
	 * Chart filter
	 */

	$scope.chartFilter = [];

	/**
	 * Years service
	 */

	$scope.periodService = periodService;
	periodService.load();

	/**
	 * Category Service
	 */
	$scope.categoryService = categoryService;
	categoryService.load();

	/**
	 * Load Data
	 */

	function loadData(callback) {
		$log.log(categoryService);
		if (categoryService.categoryPath.length > 1) {
			var path = categoryService.getPath();
			// $log.log("Category path ", categoryService.categoryPath);
			// $log.log("Path ", categoryService.getPath());
			$q.all(_.reduce(periodService.period, function(promises, year) {
				promises.push(dataStoreService.getDataForYear(path, year));
				return promises;
			}, [])).then(function(result) {
				var data = _.reduce(periodService.period, function(dataByYears, yr) {
					dataByYears[yr] = result[periodService.period.indexOf(yr)];
					return dataByYears;
				}, []);
				// $log.log("[students.js] Data", data);
				callback(data);
			});
		}
	}

	$scope.selected = function(selectedItem) {

		$log.log("students.js (selected) [selectedItem]", selectedItem);
		$log.log("students.js (selected) [categoryPath]", $scope.categoryPath);
		// var path = _.union($scope.categoryPath
		// .map(function(curr, inf, arr) {
		// return curr.name;
		// }), $scope.chart["keys"][selectedItem.row].reverse());

		var path = $scope.categoryPath.map(function(curr, inf, arr) {
			return curr.name;
		}).concat($scope.chart["keys"][selectedItem.row].reverse());

		$log.log("students.js (selected) [categoryPath]", path);

		chw.getChart().setSelection(null);

		// var modalInstance = $modal.open({
		// animation : true,
		// templateUrl : './pages/data-descriptor.html',
		// controller : 'DataDescriptorCtrl',
		// size : "modal-lg",
		// backdrop : true,
		// resolve : {
		// path : function() {
		// return path;
		// }
		// }
		// });
		//
		// modalInstance.result.then(function(key) {
		// $scope.selected = key;
		// }, function() {
		// $log.info('Modal dismissed at: ' + new Date(), key);
		// });
	}

	$scope.chartReady = function(chartWrapper) {
		$log.log("Chart Wrapper", chartWrapper);
		chw = chartWrapper;
		function setWidth() {
			$('.google-visualization-table-th:contains(' + 'Indicator' + ')').css(
			    'width', '200');
		}

		var table = chartWrapper.getChart();

		google.visualization.events.addListener(table, 'ready', setWidth);
		google.visualization.events.addListener(table, 'sort', setWidth);
		google.visualization.events.addListener(table, 'page', setWidth);

	}

	function updateTable() {
		$log.info("Using Table Builder");
		$scope.builder = $scope.chartBuilders[0];
		loadData(function(data) {
			$scope.dataTitle = "Freshmen Students";
			loadData(function(data) {
				chart = $scope.builder.build(data);
				chart.data.rows = $filter('filter')(chart.data.rows,
				    $scope.searchString);
				$scope.chart = chart;
			})
		});
	}

	function updateColumnBars() {
		$log.info("Using Column Builder");
		// Update title

		$scope.dataTitle = categoryService.categoryPath[1].name + " "
		    + categoryService.categoryPath[0].name + " by " + categoryService.categoryPath[2].name
		    + " from " + periodService.period.fromYear + " to " + periodService.period.toYear;

		var filterKeys = Object.keys(categoryService.chartFilter);
		var filter = filterKeys.filter(function(curr, ind, arr) {
			return categoryService.chartFilter[curr];
		});

		$scope.builder = categoryService.chartBuilders[1];
		loadData(function(data) {
			var keys = Object.keys(data);
			$log.log("Data", data);
			$log.log("Filter", filter);
			$log.log("Path", categoryService.categoryPath);
			var chart = $scope.builder.build(data, categoryService.categoryPath, filter);
			$scope.chart = chart;

		});

	}

	$scope.updateChart = function() {
		$log.info("[students] Category path", categoryService.categoryPath);

		/**
		 * Table builder
		 */
		if (categoryService.categoryPath.length == 2) {
			updateTable();
		} else if (categoryService.categoryPath.length == 3) {
			updateColumnBars();
		}
		// else if ($scope.categoryPath.length == 4) {
		// $log.info("Using Line Builder");
		// // $log.log("Chart filter: ", $scope.chartFilter);
		//
		// // Update title
		//
		// $scope.dataTitle = $scope.categoryPath[3].name + " "
		// + $scope.categoryPath[1].name + " "
		// + $scope.categoryPath[0].name + " by "
		// + $scope.categoryPath[2].name + " from "
		// + $scope.period.fromYear + " to " + $scope.period.toYear;
		//
		// // Filter
		//
		// var filterKeys = Object.keys($scope.chartFilter);
		// var filter = filterKeys.filter(function(curr, ind, arr) {
		// return $scope.chartFilter[curr];
		// });
		//
		// $scope.builder = $scope.chartBuilders[2];
		//
		// // Load data
		//
		// loadData(function(data) {
		// $scope.data = data;
		//
		// // $log.log("[Line Chart Builder] data", data);
		// $scope.builder.setData(data);
		// // $log.log("[Line Chart Builder] categoryPath",
		// // $scope.categoryPath);
		// $scope.builder.setPath($scope.categoryPath);
		// // $log.log("[Line Chart Builder] filter", filter);
		// $scope.builder.setFilter(filter);
		// // $log.info("[Line Chart Builder] buildChart");
		// $scope.chart = $scope.builder.buildChart();
		// });
		// }
	}

});