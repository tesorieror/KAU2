/**
 * New node file
 */

/**
 * Factory for data access
 */

app.factory('dataStoreService', function($http, $q, $log) {

	var JSON_PATH = '../en/json/';
	var PLAIN_FILE = 'data.json';
	var DESCRIPTION_FILE = 'description.json';
	var METADATA_FILE = 'metadata.json';
	var ABOUT_UNIT_FILE = 'about-unit.json';
	var YEARS_FILE = 'years.json';

	function getDataBarGroupsFilename() {
		return JSON_PATH + 'data-bar-groups.json';
	}
	function getDataBarLegendsFilename() {
		return JSON_PATH + 'data-bar-legends.json';
	}

	/**
	 * New version
	 */

	function createDeferredFunction(filename) {
		$log.info("Deferred Function for path: ", filename.toLowerCase());
		return function() {
			var deferred = $q.defer();
			$http.get(filename.toLowerCase()).then(function(result) {
				deferred.resolve(result.data);
			}, function(error) {
				deferred.reject(error);
			}, function(update) {
				deferred.update(update);
			});
			return deferred.promise;
		}
	}

	function dataFilenameFor(categoryPath, year) {
		// $log.log("Category Path", categoryPath);
		if (categoryPath.length < 2)
			throw {
			  message : "Not enough information to locate data from categoryPath",
			  categoryPath : categoryPath
			}
		else {
			return 'data/' + categoryPath[0] + '/' + categoryPath[1] + '/' + year
			    + '.json';
		}
	}

	/**
	 * Return
	 */

	return {

	  getDataForPath : function(path) {
		  var p = _.reduce(path, function(s, pe) {
			  return s.concat('/').concat(pe.toLowerCase());
		  }, JSON_PATH.slice(0, JSON_PATH.length - 1));
		  p = p.concat('.json');
//		  $log.log("p", p);
		  return createDeferredFunction(p)();
	  },

	  getDataForPathAndYear : function(path, year) {
		  var p = _.reduce(path, function(s, pe) {
			  return s.concat('/').concat(pe.toLowerCase());
		  }, JSON_PATH.slice(0, JSON_PATH.length - 1));
		  p = p + '/' + year + '.json';
//		  $log.log("p", p);
		  return createDeferredFunction(p)();
	  },

	  getNewData : createDeferredFunction(JSON_PATH + PLAIN_FILE),
	  getDataMetadata : createDeferredFunction(JSON_PATH + 'data/'
	      + METADATA_FILE),

	  getMetadata : function(root) {
		  return createDeferredFunction(JSON_PATH + root + '/' + METADATA_FILE)();
	  },

	  getYears : function(path) {
		  return createDeferredFunction(
		      JSON_PATH + path[0] + '/' + path[1] + '/' + path[2] + '/'
		          + YEARS_FILE)();
	  },
	  getAboutUnit : createDeferredFunction(JSON_PATH + ABOUT_UNIT_FILE),

	  getDataForYear : function(categoryPath, year) {
		  return createDeferredFunction(
		      JSON_PATH + dataFilenameFor(categoryPath, year))();
	  },

	  // getDataForPath : function(path) {
	  // return createDeferredFunction(
	  // JSON_PATH + path[0] + '/' + path[1] + '/' + path[2] + '/'
	  // + _.last(path) + '.json')();
	  // },

	  getDescriptionForPath : function(path) {
		  return createDeferredFunction(
		      JSON_PATH + path[0] + '/' + path[1] + '/' + path[2] + '/'
		          + DESCRIPTION_FILE)();
	  },

	  getDataBarGroups : function() {
		  var deferred = $q.defer();
		  $http.get(getDataBarGroupsFilename()).then(function(result) {
			  deferred.resolve(result.data);
		  }, function(error) {
			  $log.error(error);
			  deferred.reject(error);
		  }, function(update) {
			  deferred.update(update);
		  });
		  return deferred.promise;
	  },

	  getDataBarLegends : function() {
		  var deferred = $q.defer();
		  $http.get(getDataBarLegendsFilename()).then(function(result) {
			  deferred.resolve(result.data);
		  }, function(error) {
			  $log.error(error);
			  deferred.reject(error);
		  }, function(update) {
			  deferred.update(update);
		  });
		  return deferred.promise;
	  },

	  getHighlights : function() {
		  var deferred = $q.defer();
		  $http.get(JSON_PATH + 'highlights.json').then(function(result) {
			  // $log.log("Result", result.data);
			  deferred.resolve(result.data);
		  }, function(error) {
			  deferred.reject(error);
			  $log.error(error);
		  }, function(update) {
			  deferred.update(update);
			  $log.error(update);
		  });
		  return deferred.promise;
	  },

	  getCategories : function() {
		  var deferred = $q.defer();
		  $http.get(JSON_PATH + 'categories.json').then(function(result) {
			  // $log.log("Result", result.data);
			  deferred.resolve(result.data);
		  }, function(error) {
			  deferred.reject(error);
			  $log.error(error);
		  }, function(update) {
			  deferred.update(update);
			  $log.error(update);
		  });
		  return deferred.promise;
	  },

	  getSubCategories : function(category) {
		  var deferred = $q.defer();
		  $http.get(JSON_PATH + category + '.json').then(function(result) {
			  // $log.log("Result", result.data);
			  deferred.resolve(result.data);
		  }, function(error) {
			  deferred.reject(error);
			  $log.error(error);
		  }, function(update) {
			  deferred.update(update);
			  $log.error(update);
		  });
		  return deferred.promise;
	  },

	  getData : function(indicator) {
		  // $log.log("[DataStoreService] Data indicator: ",
		  // indicator);
		  var yearCalls = [];
		  angular.forEach(indicator.getDataFilenames(), function(fn) {
			  yearCalls.push($http.get(fn));
		  });
		  // $log.log('[DataStoreService] Indicator data
		  // filenames ',
		  // indicator
		  // .getDataFilenames());
		  // $log.log('[DataStoreService] yearCalls ',
		  // yearCalls);
		  var deferred = $q.defer();
		  $q.all(yearCalls).then(function(results) {
			  var answer = [];
			  // $log.log('[DataStoreService] years ',
			  // indicator.period.getPeriod());
			  // $log.log('[DataStoreService] results
			  // ', results);
			  angular.forEach(indicator.period.getPeriod(), function(yr, i) {
				  answer[yr] = results[i].data;
			  });
			  deferred.resolve(answer);
		  }, function(errors) {
			  $log.error("[DataStoreService] ", errors);
			  deferred.reject(errors);
		  }, function(updates) {
			  deferred.update(updates);
		  });
		  return deferred.promise;
	  },
	};
});
