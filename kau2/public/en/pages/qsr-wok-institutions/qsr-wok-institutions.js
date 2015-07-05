app.controller('QSRWoKInstitutionsCtrl', function($scope, $log, $location, $q,
    $route, $filter, $location, indicatorFactory, qsrWoKInstitutionTable,
    qsrWoKInstitutionLine, qsrWoKInstitutionColumn) {

	$log.info("Loading QSRWoKInstitutionCtrl Controller");
	// $log.log("Params", $route.current.params);

	// Set up indicator
	var indicator = indicatorFactory;

	// Load data
	indicator.load($location.path(), initialize);

	// Initialize
	function initialize() {
		// Title
		$scope.title = indicator.getTitle();
		//
		// Category
		var category = indicator.getCategoryAtLevel(1);

		// Subcategories
		$scope.subcategories = category.children;
		$scope.subcategory = indicator.getCategoryAtLevel(2);
		//
		// Subsubcategories
		$scope.subsubcategories = $scope.subcategory.children;
		$scope.subsubcategory = indicator.getCategoryAtLevel(3);

		// Subsubsubcategories
		$scope.subsubsubcategories = $scope.subsubcategory.children;

		$log.log($scope.subsubcategory);

		// $scope.subsubsubcategory = indicator.getCategoryAtLevel(4);
		//
		// // Subsubsubsubcategories
		// $scope.subsubsubsubcategories = $scope.subsubsubcategory.children;
		//
		// Period
		$scope.years = indicator.getYears();
		$scope.from = indicator.getFrom();

		// Patch to select all but the last one
		// $scope.to = indicator.getTo();
		$scope.to = indicator.getYears()[1];
		//
		// ChartType
		$scope.chartTypes = [ {
		  name : "Table",
		  id : "Table",
		  factory : qsrWoKInstitutionTable
		}, {
		  name : "Lines",
		  id : "LineChart",
		  factory : qsrWoKInstitutionLine
		// TODO Set properly
		}, {
		  name : "Columns",
		  id : "ColumnChart",
		  factory : qsrWoKInstitutionColumn
		// TODO Set properly
		} ];

		$scope.chartType = $scope.chartTypes[0];

		// filter
		$scope.filter = indicator.getFilter();
		$scope.filter['King Abdulaziz University'] = false;
    $scope.filterStatus = {
		    open : false
	    };
		// Refresh chart
		$scope.refreshChart = function() {
			indicator.setFrom($scope.from);
			indicator.setTo($scope.to);
			indicator.setFilter($scope.filter);
			$scope.chartType.factory.build(function(chart) {
				$scope.chart = chart;
			});
		}
		// Show default chart
		$scope.refreshChart();
	}

	/**
	 * Hide chart if no information is chosen
	 */

	$scope.isFilterEmpty = function() {
		var result = false;
		for (filterElement in $scope.filter)
			result = result || $scope.filter[filterElement];
		return !result;
	}
	
  $scope.chartSelectedItem = function(selectedItems, selectedItem,
      chartWrapper) {
    $log.log("Selected Item", selectedItem);
    // Patch to unselect!
    chartWrapper.getChart().setSelection(null);

    var key = $scope.chart.data.rows[selectedItem.row]["c"][0]["v"]
    $log.log(key);

    for (k in $scope.filter) {
	    $scope.filter[k] = k == key;
    }

    $scope.chartType = $scope.chartTypes[1];
    $scope.refreshChart();
  }

  $scope.filterSelectAll = function() {
    for (k in $scope.filter) {
	    $scope.filter[k] = k != 'King Abdulaziz University';
    }		    
    $scope.refreshChart();
    $scope.filterStatus.open = true;
  }

  $scope.filterUnselectAll = function() {
    for (k in $scope.filter) {
	    $scope.filter[k] = k == 'King Abdulaziz University';
    }		    
    $scope.refreshChart();		    
    $scope.filterStatus.open = true;
  }
	
	
	
	
});