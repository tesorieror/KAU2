app.directive('rHighlight', function() {
	return {
		restrict : 'E',
		templateUrl : 'directives/r-highlight.html',
		controller : 'RHighlightCtrl',
		scope : {
			data : '='
		},
	};
});

app.controller('RHighlightCtrl', function($scope, $log, $attrs) {
	// $log.log('r-Highlights[data] (scope) ', $scope.data);

	$scope.createClickEvent = function(region) {
		return {
			id : $scope.data.id,
			location : region
		};
	};

});