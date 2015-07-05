/**
 * New node file
 */

app.controller('CategoryCtrl', function($scope, $log, $location, $route,
    $location, dataStoreService) {

	var categoryName = $route.current.params.category;
	var subcategoryName = $route.current.params.subcategory;

	var path = $location.path().split("/");
	var rootPathName = path[1];

	$log.info("Loading Category Controller");
//	$log.log($route.current.params);

	// Title
	$scope.title = ((subcategoryName == null) ? "" : (subcategoryName
	    .firstToUpper() + " "))
	    + ((categoryName == null) ? "" : (categoryName.firstToUpper() + " "))
	    + rootPathName.firstToUpper();

	// Load metadata
	// As path starts with /, the first one is ""
	dataStoreService.getMetadata(rootPathName).then(
	    function(result) {

		    // Root
		    var back = {
		      name : "Home",
		      href : "#/Main",
		      image : "./img/home.png",
		      title : "Home",
		      description : "Click to go back to Home"
		    };

		    var categorySet = result;

		    var actual = null;
		    var parent = null;

		    // Category
		    if (categoryName != null) {
			    actual = _.detect(result, function(cat) {
				    return cat.name.toUpperCase() == categoryName.toUpperCase()
			    });

			    // Update Back
			    back.href = "#/" + rootPathName + "/"
			    back.name = rootPathName.firstToUpper();
			    back.title = rootPathName.firstToUpper();
			    back.image = "./img/" + rootPathName + ".png";
			    back.description = "Click to go back to "
			        + rootPathName.firstToUpper();

			    // Subcategory
			    if (subcategoryName != null) {
				    parent = actual;
				    actual = _.detect(parent.children, function(cat) {
					    return cat.name.toUpperCase() == subcategoryName.toUpperCase()
				    });

				    // Update Back
				    // back.href = "#/" + rootPathName + "/" + categoryName
				    // + "/";
				    back = parent;
			    }

			    categorySet = actual.children;
		    }

		    categorySet = [ back ].concat(categorySet);

		    $log.log("Category set", categorySet);

		    // Grid
		    var cols = 3;
		    $scope.grid = [];
		    var row;
		    for (i = 0; i < categorySet.length; i++) {
			    if (i % cols == 0) {
				    row = [];
				    $scope.grid.push(row);
			    }
			    row[i % cols] = categorySet[i];
		    }

	    });

});