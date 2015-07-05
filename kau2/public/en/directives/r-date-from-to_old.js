app.directive('rDateFromTo', function() {
	return {
	  restrict : 'E',
	  templateUrl : 'directives/r-date-from-to.html',
	  controller : 'RDateFromToCtrl',
	  scope : {
	    years : '=',
	    period : '=',
	    fromChange : '&',
	    toChange : '&'
	  },
	};
});

app.filter("filterFromYears", function() {
	return function(years, toYear) {
		var answer = [];
		angular.forEach(years, function(value, key) {
			if (value <= toYear)
				answer.push(value);
		});
		return answer;
	};
});

app.filter("filterToYears", function() {
	return function(years, fromYear) {
		var answer = [];
		angular.forEach(years, function(value, key) {
			if (value >= fromYear)
				answer.push(value);
		});
		return answer;
	};
});

app.controller('RDateFromToCtrl', function($scope, $log, periodService) {
	$scope.periodService = periodService;
	$scope.periodService.load();
});