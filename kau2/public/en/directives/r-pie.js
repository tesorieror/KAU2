app.directive('rPie', function() {
	return {
		restrict : 'E',
		templateUrl : 'directives/r-pie.html',
		controller : 'RPieCtrl',
		scope : {
			chart : '='
		},
	};
});

app.controller('RPieCtrl', function($scope, $log, $attrs) {

});