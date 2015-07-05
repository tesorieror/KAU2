app.controller("StudentsCtrl", function($http, $q, $log, $routeParams, $scope,
    dataStoreService, $filter, tableChartBuilderService,
    columnChartBuilderService) {
	// $log.info("Students controller running...");

	/**
	 * Initialize chart builders
	 */
	$scope.chartBuilders = [];
	$scope.chartBuilders[0] = tableChartBuilderService;
	$scope.chartBuilders[1] = columnChartBuilderService;
	$scope.chartBuilders[2] = tableChartBuilderService;
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
	$scope.chart = {};

	/**
	 * Period
	 */
	$scope.period = {};

	/**
	 * Load years
	 */

	dataStoreService.getYears().then(function(years) {
		$scope.years = years;
		$scope.period.fromYear = years[years.length - 1];
		$scope.period.toYear = years[0];
		$scope.period.years = years.slice(0);
	});

	/**
	 * Category path selection
	 */

	dataStoreService.getDataMetadata().then(function(categories) {
		$scope.categories = categories;
		$scope.categoryPath = [ $scope.categories[0] ];
		$scope.categoryPathSelection = $scope.categories[0];
		$scope.subcategories = $scope.categories[0].children;
		$scope.subcategorySelection = null;
	});

	$scope.categoryPathClicked = function(category) {
		var i = $scope.categoryPath.indexOf(category);
		var len = $scope.categoryPath.length;
		$scope.categoryPath.splice(i + 1, len - i - 1);
		$scope.categoryPathSelection = category;
		$scope.subcategorySelection = null;
		$scope.subcategories = category.children;
	}

	$scope.subcategoryClicked = function(category) {
		$scope.categoryPath.push(category);
		$scope.categoryPathSelection = category;
		$scope.subcategories = category.children;
		$scope.subcategorySelection = null;
	}

	/**
	 * Load Data
	 */

	function loadData(loaded) {
		if ($scope.categoryPath.length > 1) {
			var path = $scope.categoryPath.map(function(curr, ind, arr) {
				return curr.name
			});
			$log.info("Loading data ", $scope.categoryPath, $scope.period.years);
			$q.all($scope.period.years.reduce(function(prev, curr, ind, arr) {
				prev.push(dataStoreService.getDataForYear(path, curr));
				return prev;
			}, [])).then(function(result) {
				var data = result.reduce(function(prev, curr, ind, arr) {
					prev[$scope.period.years[ind]] = result[ind];
					return prev;
				}, []);
				$log.log("[students.js] Data", data);
				loaded(data);
			});
		}
	}

	$scope.updateChart = function() {
		$log.info("[students] Category path", $scope.categoryPath);
		if ($scope.categoryPath.length == 2) {
			$log.info("Table Builder");
			$scope.builder = $scope.chartBuilders[0];
			loadData(function(data) {
				var chart = $scope.builder.build(data);
				chart.data.rows = $filter('filter')(chart.data.rows,
				    $scope.searchString);
				$scope.chart = chart;
			});
		} else if ($scope.categoryPath.length == 3) {
			$log.info("Column Builder");
			$scope.builder = $scope.chartBuilders[1];
			loadData(function(data) {
				var chart = $scope.builder.build(data);
				// chart.data.rows = $filter('filter')(chart.data.rows,
				// $scope.searchString);
				$scope.chart = chart;
			});
		}
	}

});