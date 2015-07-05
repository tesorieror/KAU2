app.controller('QSRWoKCountriesCtrl',
    function($scope, $log, $location, $q, $route, $filter, $location,
        indicatorFactory, qsrWoKCountriesTable, qsrWoKCountriesLine,
        qsrWoKCountriesColumn, qsrWoKCountriesLineByPublications,
        qsrWoKCountriesColumnByPublications) {

	    $log.info("Loading QSRWoKCountriesCtrl Controller");
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
		      factory : qsrWoKCountriesTable
		    }, {
		      name : "Lines (byYear)",
		      id : "LineChart",
		      factory : qsrWoKCountriesLine
		    // TODO Set properly
		    }, {
		      name : "Lines (by Publications)",
		      id : "LineChart",
		      factory : qsrWoKCountriesLineByPublications
		    // TODO Set properly
		    }, {
		      name : "Columns (by Year)",
		      id : "ColumnChart",
		      factory : qsrWoKCountriesColumn
		    // TODO Set properly
		    }, {
		      name : "Columns (by Publications)",
		      id : "ColumnChart",
		      factory : qsrWoKCountriesColumnByPublications
		    // TODO Set properly
		    } ];

		    $scope.chartType = $scope.chartTypes[0];

		    // filter
		    $scope.filter = indicator.getFilter();
		    $scope.filter['Saudi Arabia'] = false;
		    $scope.filterStatus = {
			    open : false
		    };

		    // Refresh chart
		    $scope.refreshChart = function() {
			    indicator.setFrom($scope.from);
			    indicator.setTo($scope.to);
			    indicator.setFilter($scope.filter);
			    $scope.chartType.factory.build(function(chart) {
				    // String filter
				    // TODO See if it should be in indicator

				    chart.data.rows = $filter('filter')(chart.data.rows,
				        $scope.searchString);
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
			    $scope.filter[k] = k != 'Saudi Arabia';
		    }		    
		    $scope.refreshChart();
		    $scope.filterStatus.open = true;
	    }

	    $scope.filterUnselectAll = function() {
		    for (k in $scope.filter) {
			    $scope.filter[k] = k == 'Saudi Arabia';
		    }		    
		    $scope.refreshChart();		    
		    $scope.filterStatus.open = true;
	    }

    });