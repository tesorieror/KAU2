/**
 * New node file
 */

app.controller('SubcategoryCtrl',
    function($scope, $modal, $log, $location, $q, $route, $filter, $location,
        $window, dataStoreService) {
	    $log.info("Loading Subcategory Controller");
	    $log.log("Params", $route.current.params);

	    // Navigation active item
	    $scope.activePath = $location.path();

	    var metadata;
	    var years;
	    var path = $location.path();

	    var rootPathName = path.split("/")[1];
	    var categoryName = $route.current.params.category;
	    var subcategoryName = $route.current.params.subcategory;

	    // Export category names
	    $scope.rootPathName = rootPathName;
	    $scope.categoryName = categoryName;
	    $scope.subcategoryName = subcategoryName;

	    $log.info("Loading Table Data Controller");
	    // $log.info("Location path", $location.path());
	    // $log.info("Route parameters", $route.current.params);
	    // $log.info("Template", $route.current.templateUrl);

	    $log.log(rootPathName);
	    $log.log(categoryName);
	    $log.log(subcategoryName);

	    $q.all(
	        [
	            dataStoreService.getMetadata(rootPathName),
	            dataStoreService.getYears([ rootPathName, categoryName,
	                subcategoryName ]) ]).then(function(result) {
		    metadata = result[0];
		    years = result[1];
		    initialize();
	    });

	    function initialize() {
		    // Title
		    $scope.title = subcategoryName.firstToUpper() + " "
		        + categoryName.firstToUpper() + " " + rootPathName.firstToUpper();

		    // Metadata
		    $scope.parent = _.detect(metadata, function(cat) {
			    return cat.name.firstToUpper() == categoryName.firstToUpper()
		    });

		    $scope.actual = _.detect($scope.parent.children, function(subcat) {
			    return subcat.name.firstToUpper() == subcategoryName.firstToUpper();
		    });

		    // Subcategories
		    $scope.subcategoryNames = _.map($scope.parent.children, function(data) {
			    return data.name;
		    });

		    // Period
		    $scope.years = years;
		    $scope.from = _.last(years);
		    $scope.to = _.first(years);
		    $scope.period = years;

		    // Chart
		    $scope.chartRefresh();

		    $log.log("Subcategory activePath", $scope.activePath);
	    }

	    $scope.chart;

	    $scope.searchString;

	    // Events
	    $scope.chartReady = function(chartWrapper) {
		    $log.info("Configuring table chart");

		    function setWidth() {
			    $('.google-visualization-table-th:contains(' + 'Indicator' + ')')
			        .css('width', '200');
		    }

		    var table = chartWrapper.getChart();

		    google.visualization.events.addListener(table, 'ready', setWidth);
		    google.visualization.events.addListener(table, 'sort', setWidth);
		    google.visualization.events.addListener(table, 'page', setWidth);
	    }

	    $scope.chartClicked = function(chart) {
	    }

	    $scope.chartSelectedItem = function(selectedItems, selectedItem,
	        chartWrapper) {
		    // $log.log("Selected", selectedItem);
		    // $log.log("Object",
		    // $scope.chart.data.rows[selectedItem.row]["c"][0]["k"]);

		    // Patch to unselect row
		    chartWrapper.getChart().setSelection(null);

		    // Get the key from the row
		    var key = $scope.chart.data.rows[selectedItem.row]["c"][0]["k"];

		    /**
				 * Route Path
				 */
		    // var subsubcategoryName = key[0];
		    // var subsubsubcategoryName = key[1];
		    // var subsubsubsubcategoryName = key[2];
		    // var path = "/description/" + rootPathName + "/category/" +
		    // categoryName
		    // + "/subcategory/" + subcategoryName + "/subsubcategory/"
		    // + subsubcategoryName + "/subsubsubcategory/"
		    // + subsubsubcategoryName + "/";
		    // if (key.length > 2)
		    // path = path + "subsubsubsubcategory/" + subsubsubsubcategoryName;
		    // // $log.log(path);
		    // //$location.path(path);
		    // Build the path
		    var path = [ rootPathName, categoryName, subcategoryName ].concat(key);
		    // Open dialog
		    $scope.openDescriptionDialog('lg', path);
	    }

	    // Period
	    $scope.periodChanged = function() {
		    $scope.period = getPeriod();
		    $scope.chartRefresh();
	    }

	    function getPeriod() {
		    var s = $scope.years.indexOf($scope.to);
		    var e = $scope.years.indexOf($scope.from);
		    return $scope.years.slice(s, e + 1);
	    }

	    // Navigation

	    $scope.subsubcategoryClicked = function(subsubcat) {
		    // var path =
		    // "/data/category/students/subcategory/freshmen/subsubcategory/gender";
		    // $log.log("Go to", path);
		    var path = "/" + rootPathName + "/category/" + categoryName
		        + "/subcategory/" + subcategoryName + "/subsubcategory/"
		        + subsubcat.name.toLowerCase();
		    // $log.log("Go to", path);
		    $location.path(path);
	    }

	    $scope.goToParent = function() {
		    var path = "/" + rootPathName + "/category/" + categoryName;
		    // $log.log(path);
		    $location.path(path);
	    }

	    // Refresh chart
	    $scope.chartRefresh = function() {
		    var period = $scope.period;
		    // $log.log("Period", period);
		    // $log.log("Chart refresh");
		    // $log.log("From", $scope.from);
		    // $log.log("To", $scope.to);
		    $q.all(
		        _.map(period, function(year) {
			        return dataStoreService.getDataForYear([ categoryName,
			            subcategoryName ], year);
		        })).then(
		        function(results) {
			        // $log.log("Results", results);
			        var data = _.reduce(period, function(res, year) {
				        res[year] = results[period.indexOf(year)];
				        return res;
			        }, []);
			        // $log.log("Data", data);
			        // Filter Data
			        var chart = build(data);
			        chart.data.rows = $filter('filter')(chart.data.rows,
			            $scope.searchString);
			        $scope.chart = chart;
		        });
	    }

	    function build(data) {
		    // $log.log("build - data", data);
		    return {
		      "type" : 'Table',
		      "displayed" : true,
		      "data" : {
		        "cols" : buildCols(data),
		        "rows" : buildRows(data)
		      },
		      "options" : {
		        "width" : "670",
		        "height" : "450",
		        "pageSize" : "10",
		        "page" : "enable",
		        "showRowNumber" : false,
		        "sort" : "enable"
		      }
		    };
	    }

	    function buildCols(data) {
		    return _.reduce($scope.period, function(cols, yr) {
			    cols.push({
			      "id" : "year-" + yr,
			      "label" : yr,
			      "type" : "number",
			      "p" : {}
			    });
			    return cols;
		    }, [ {
		      "id" : "indicator",
		      "label" : "Indicator",
		      "type" : "string",
		      "p" : {},
		    } ]);
	    }

	    function buildKeys() {
		    return _.reduce($scope.actual.children, function(keys, cat) {
			    return keys.concat(getKeysFor(cat));
		    }, []);
	    }

	    function buildRows(data) {
		    // $log.log("buildKeys - data", data);
		    return _.map(buildKeys(), function(key) {
			    // $log.log("buildKeys - key", key);
			    return {
				    "c" : _.reduce($scope.period, function(acc, year) {
					    acc.push({
						    "v" : rowValue(data[year], key)
					    });
					    return acc;
				    }, [ {
				      "v" : rowLabel(key),
				      "k" : key
				    } ])
			    };
		    });
	    }

	    function rowValue(obj, key) {
		    // $log.log("rowValue - obj ", obj, "key", key);
		    return _.reduce(key, function(acc, k) {
			    return acc[k];
		    }, obj);
	    }

	    function rowLabel(key) {
		    // $log.log("Key", key);
		    // Get Value
		    return _.reduce(key, function(acc, k) {
			    return acc.concat(k).concat(" ");
		    }, "");
	    }

	    function getKeysFor(cat) {
		    if (cat.children.length < 1)
			    return [ [ cat.name ] ];
		    else
			    return _.reduce(cat.children, function(keyList, subcat) {
				    return keyList.concat(_.map(getKeysFor(subcat), function(key) {
					    return [ cat.name ].concat(key);
				    }));
			    }, []);
	    }

	    /**
			 * Dialog description
			 */
	    $scope.openDescriptionDialog = function(size, path) {

		    var dialogResult = null;

		    var modalInstance = $modal.open({
		      animation : $scope.animationsEnabled,
		      templateUrl : './pages/data-descriptor.html',
		      controller : 'DataDescriptorCtrl',
		      size : size,
		      resolve : {
			      path : function() {
				      return path;
			      }
		      }
		    });

		    modalInstance.result.then(function(result) {
			    dialogResult = result;
			    $log.info('Dialog result', dialogResult);
		    }, function() {
			    $log.info('Modal dismissed at: ' + new Date());
		    });
	    };

    });