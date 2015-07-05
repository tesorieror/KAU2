app.directive('rDateFromTo', function() {
	return {
	  restrict : 'E',
	  templateUrl : 'directives/r-date-from-to.html',
	  controller : 'RDateFromToCtrl',
	  scope : {
	    years : '=',
	    from : '=',
	    to : '=',
	    onChange : '&'
	  }
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

app.controller('RDateFromToCtrl', function($scope, $log) {
	$log.info("Loading Date From To Directive Controller");
	$scope.change = function() {
		$log.log("!F", $scope.from, "!T", $scope.to);
		$scope.onChange({
		  f : $scope.from,
		  t : $scope.to
		});
	}
});