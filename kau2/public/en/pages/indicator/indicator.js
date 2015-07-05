app.controller("IndicatorCtrl", function($scope, $http, $q, $log) {
	$log.info("Indicator controller loaded...");

	$scope.title = "Indicator";

	$scope.tagCategoryNames = [ 'YR', 'IT', 'SS', 'GR', 'NA', 'GE' ];

	$scope.filterStatus = {
		open : false
	};

	$scope.tagCategories = [];

	$scope.tags = [];

	$scope.tagModel = [];

	var tagCategoryLoadedProm = [];

	_.each($scope.tagCategoryNames, function(tagCategoryName) {
		tagCategoryLoadedProm.push($http
				.get('/tagCategory/name/' + tagCategoryName).then(function(res) {
					var deferred = $q.defer();
					if (res.status == 200) {
						console.log(res.status, res.statusText);
						var category = _.first(res.data);
						$scope.tagCategories[tagCategoryName] = category;
						$scope.tagModel[tagCategoryName] = [];
						deferred.resolve(category);
					} else {
						console.error(res.status, res.statusText);
						deferred.reject(res);
					}
					return deferred.promise;
				}));
	});

	$q.all(tagCategoryLoadedProm).then(function(data, err) {
		console.log("Tag Category", data);
	});

	$q.all(tagCategoryLoadedProm).then(
			function(data, err) {
				var tagLoadedProm = [];
				_.each($scope.tagCategoryNames, function(tagCategoryName) {
					tagLoadedProm.push($http.get(
							'/tag/category/' + $scope.tagCategories[tagCategoryName]._id)
							.then(
									function(res) {
										var deferred = $q.defer();
										if (res.status == 200) {
											console.log(res.status, res.statusText);
											console.log(res);
											$scope.tags[tagCategoryName] = _
													.sortBy(res.data, 'order');
											_.each($scope.tags[tagCategoryName], function(tag) {
												$scope.tagModel[tagCategoryName][tag._id] = false;
											});
											$scope.tagModel[tagCategoryName][_
													.first($scope.tags[tagCategoryName])._id] = true;
											console.log("TagModel", $scope.tagModel);
											deferred.resolve(res.data);
										} else {
											console.error(res.status, res.statusText);
											deferred.reject(res);
										}
										return deferred.promise;
									}));
				});
				$q.all(tagLoadedProm).then(function(data, err) {
					console.log("Tags", $scope.tags);
				});
			});

	$scope.selectedTagsFor = function(categoryName) {
		return _.map(_.filter(_.allKeys($scope.tagModel[categoryName]),
				function(tagId) {
					return $scope.tagModel[categoryName][tagId];
				}), function(id) {
			return _.findWhere($scope.tags[categoryName], {
				_id : id
			});
		});
	};

	$scope.getSelectedTags = function() {
		return _.reduce($scope.tagCategoryNames, function(acc, categoryName) {
			acc[categoryName] = $scope.selectedTagsFor(categoryName);
			return acc;
		}, []);
	}

	function getTagCollections() {

		var tagsByCategoryName = $scope.getSelectedTags();

		var result = [ [] ];

		_.each($scope.tagCategoryNames, function(tagCategoryName) {
			var tagLevel = tagsByCategoryName[tagCategoryName];
			var newResult = [];
			_.each(tagLevel, function(tag) {
				_.each(result, function(tagCol) {
					var newCol = tagCol.slice();
					newCol.push(tag);
					newResult.push(newCol);
				});
			});
			result = newResult;
		});
		return result;
	}

	$scope.tagChanged = function(tag) {
		var tagCollections = getTagCollections();
		console.log("tagCollections", tagCollections);

		// var tagCollection = tagCollections[0];
		// var idCollection = _.map(tagCollection, '_id');
		//
		// var idCollectionString = _.reduce(idCollection, function(result, id) {
		// return result.concat(',').concat(id);
		// }, '').substring(1);

		var proms = _.map(tagCollections, function(tagCollection) {
			var idCollection = _.map(tagCollection, '_id');

			var idCollectionString = _.reduce(idCollection, function(result, id) {
				return result.concat(',').concat(id);
			}, '').substring(1);

			return $http.get('/indicator/tags/' + idCollectionString).then(
					function(res) {
						var deferred = $q.defer();
						if (res.status == 200) {
							console.log(res.status, res.statusText);
							console.log(res.data);
							deferred.resolve(res.data);
						} else {
							console.error(res.status, res.statusText);
							deferred.reject(res);
						}
						return deferred.promise;
					});

		});

		$q.all(proms).then(function(data, err) {
			console.log("DATA", data);
			
//			$scope.chart=
			
			
		});

		// $scope.selectedTag = $scope.tags[0];
	};

	$scope.accordionClicked = function() {
		if (!$scope.filterStatus.open) {
			$scope.tagChanged(null);
		}
	};

});