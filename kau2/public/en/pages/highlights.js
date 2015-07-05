/**
 * New node file
 */
app.controller('HighlightsCtrl', function($scope, $log, dataStoreService) {

	dataStoreService.getHighlights().then(function(results) {
		$log.log(results);
		$scope.highlights = results;
	});
});