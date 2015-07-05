/**
 * New node file
 */

app.controller('GoalOfTheUnitCtrl', function($scope, $log, $location,
    dataStoreService) {
	$scope.activePath = $location.path();
	$log.log('Active path:', $scope.activePath);
});