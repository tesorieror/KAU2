app.directive('rSingleSelection', function() {
	return {
		restrict : 'E',
		templateUrl : 'directives/r-single-selection.html',
		controller : 'RSingleSelectionCtrl',
		scope : {
			items : '=',
			selection : '=',
			label : '@',
			changed : '&',
		},
	};
});

app.controller('RSingleSelectionCtrl', function($scope, $log, $attrs) {
	$scope.filterString = '';

	$scope.clearFilterString = function() {
		$scope.filterString = '';
	}
});