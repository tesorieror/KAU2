app.directive('rMultipleSelection', function() {
	return {
		restrict : 'E',
		templateUrl : 'directives/r-multiple-selection.html',
		controller : 'RMultipleSelectionCtrl',
		scope : {
			items : '=',
			selection : '=',
			label : '@',
			changed : '&',
		},
	};
});

app.controller('RMultipleSelectionCtrl', function($scope, $log, $attrs) {
	$scope.filterString = '';

	$scope.clearFilterString = function() {
		$scope.filterString = '';
	}
	$scope.selectAll = function() {
		$scope.filterString = '';
		angular.forEach($scope.items, function(v, k) {
			$scope.selection[k] = v;
		});
		$scope.changed({
			item : $scope.selection
		});
	}
	$scope.deselectAll = function() {
		$scope.filterString = '';
		angular.forEach($scope.items, function(v, k) {
			$scope.selection[k] = null;
		});
		$scope.changed({
			item : $scope.selection
		});
	}
});