/**
 * New node file
 */

app.controller('DataCtrl', function($scope, $log, $location, dataStoreService) {

	$log.info("Loading Data Controller");
	// Load Data metadata

	dataStoreService.getDataMetadata().then(function(result) {
		$scope.metadata = result;
		//$log.log($scope.metadata);

		// Grid
		var cols = 3;
		$scope.grid = [];
		var row;
		for (i = 0; i < result.length; i++) {
			if (i % cols == 0) {
				row = [];
				$scope.grid.push(row);
			}
			row[i % cols] = result[i];
		}
		
		
	});

	// Data
	// $scope.data = {};

	// dataStoreService.getAboutUnit().then(function(result) {
	// $scope.data = result;
	// });

});