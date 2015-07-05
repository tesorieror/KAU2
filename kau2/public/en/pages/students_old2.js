/**
 * New node file
 */

app.controller('StudentsCtrl', function($scope, $log, $location,
    dataStoreService) {

	$log.info("Loading Student Controller");
	// Load Data metadata

	dataStoreService.getDataMetadata().then(function(result) {

		var category = _.detect(result, function(cat) {
			return cat.name == 'Students'
		});

		// Grid

		var cols = 3;
		$scope.grid = [];
		var row;
		for (i = 0; i < category.children.length; i++) {
			if (i % cols == 0) {
				row = [];
				$scope.grid.push(row);
			}
			row[i % cols] = category.children[i];
		}

	});

	// Data
	// $scope.data = {};

	// dataStoreService.getAboutUnit().then(function(result) {
	// $scope.data = result;
	// });

});