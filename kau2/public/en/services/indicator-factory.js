/**
 * New node file
 */
/**
 * Factory for data access
 */

app.factory('indicatorFactory', function($http, $q, $log, dataStoreService) {

	var factory = {};

	// var params = [ '', 'category', 'subcategory', 'subsubcategory',
	// 'subsubsubcategory', 'subsubsubsubcategory' ];

	var _stringPath = null;
	var _stringPathArray = [];
	var _categories = null;

	var _years = null;
	var _from = null;
	var _to = null;
	var _filter = null;

	// var _keys = [];

	factory.load = function(stringPath, loaded) {
		_stringPath = stringPath;
		_stringPathArray = buildPathStringArray();

		var rootString = _stringPathArray[0];

		$q.all(
		    [ dataStoreService.getMetadata(rootString),
		        dataStoreService.getYears(_stringPathArray) ]).then(
		    function(results) {
			    _categories = results[0];
			    _years = results[1];
			    _from = _.last(_years);
			    _to = _.first(_years);

			    // Filter DO NOT REMOVE! filter defaults!
			    _filter = _.reduce(factory
			        .getCategoryAtLevel(_stringPathArray.length - 1).children,
			        function(filter, cat) {
				        filter[cat.name] = cat.name != 'Total'; // Avoid
				        // selecting
				        // total
				        return filter;
			        }, []);
			    //
			    // // Keys
			    // _keys = getAllKeys();

			    loaded();
		    });
	};

	factory.getStringPathArray = function() {
		return _stringPathArray;
	}

	factory.getDataForYears = function(dataLoaded) {
		var period = factory.getPeriod();
		var category = _stringPathArray[1];
		var subcategory = _stringPathArray[2];

		$q.all(_.map(period, function(year) {
			return dataStoreService.getDataForYear([ category, subcategory ], year);
		})).then(function(results) {
			var data = _.reduce(period, function(res, year) {
				res[year] = results[period.indexOf(year)];
				return res;
			}, []);
			dataLoaded(data);
		});
	};

	factory.getPeriod = function() {
		var s = _years.indexOf(_to);
		var e = _years.indexOf(_from);
		return _years.slice(s, e + 1);
	}

	// factory.getTitle = function() {
	// var revPath = _stringPathArray.slice(0).reverse();
	// // Converts data into Data
	// revPath[revPath.length - 1] = revPath[revPath.length - 1].firstToUpper();
	// return _.reduce(revPath, function(result, elem) {
	// return result.concat(elem).concat(' ');
	// }, '');
	// };

	factory.getTitle = function() {
		var catPath = [];

		// Convert to category path
		for (var i = 1; i < _stringPathArray.length; i++) {
			catPath.push(factory.getCategoryAtLevel(i))
		}

		// Reverse
		catPath.reverse();
		// Concat title or name
		var result = _.reduce(catPath, function(result, elem) {
			return result.concat(elem.title == null ? elem.name : elem.title).concat(
			    ' ');
		}, '');

		// Add root at the end
		result = result.concat(_stringPathArray[0].firstToUpper());
		return result;

	};

	factory.getCategoryAtLevel = function(level) {
//		$log.log("getCategoryAtLevel", _stringPathArray);
//		$log.log("getCategoryAtLevel", level);
		var children = _categories;
		var result = _stringPathArray[0];
		for (var i = 1; i <= level; i++) {
			result = _.detect(children, function(cat) {
				return cat.name == _stringPathArray[i];
			});
			children = result.children;
		}
		return result;
	}

	/**
	 * Keys
	 */

	factory.getRelativeFilteredKeysForPath = function() {
		return _.map(factory.getFilteredKeysForPath(), function(k) {
			return k.slice(_stringPathArray.length, _stringPathArray.length + 1);
		});
	}

	factory.getFilteredKeysForPath = function() {
		var keys = getKeysForPathLevel();
		// filter keys
		keys = _.filter(keys, function(key) {
			return _filter[key[_stringPathArray.length]];
		});
		// Filter keys that are longer and are not total
		$log.log("FILTER TOTAL?");
		return keys;
	}

	function getKeysForPathLevel() {
		// remove keys that do not reach the level
		return _.filter(getKeysForPath(), function(key) {
			return key.length >= _stringPathArray.length;
		});
	}

	function getKeysForPath() {
		var basekey = _stringPathArray.slice(0, _stringPathArray.length - 1);
		var cat = factory.getCategoryAtLevel(_stringPathArray.length - 1);
		var result = keysFor(cat);
		// Add base path
		result = _.map(result, function(key) {
			return basekey.slice(0).concat(key);
		});
		return result;
	}

	function getAllKeys() {
		var keysUpToCategory = _.reduce(_categories, function(keys, cat) {
			keys = keys.concat(keysFor(cat));
			return keys;
		}, [])
		// Adding root
		return _.map(keysUpToCategory, function(key) {
			return [ _stringPathArray[0] ].concat(key);
		});
	}

	function keysFor(cat) {
		var result;
		if (cat.children.length == 0)
			result = [ [ cat.name ] ];
		else {
			var childrenKeys = _.reduce(cat.children, function(keys, subcat) {
				keys = keys.concat(keysFor(subcat));
				return keys;
			}, []);
			result = _.map(childrenKeys, function(key) {
				return [ cat.name ].concat(key);
			});
		}
		return result;
	}

	/**
	 * Period
	 */

	factory.getYears = function() {
		return _years;
	};

	factory.getFrom = function() {
		return _from
	};

	factory.getTo = function() {
		return _to
	};

	factory.setFrom = function(from) {
		_from = from
	};

	factory.setTo = function(to) {
		_to = to
	};

	/**
	 * Filter
	 */

	factory.getFilter = function() {
		return _filter;
	}

	factory.setFilter = function(filter) {
		_filter = filter;
	}

	/**
	 * Get Data
	 */
	factory.getPathData = function(loaded) {
		dataStoreService.getDataForPath(_stringPathArray).then(function(result) {
			loaded(result);
		});
	}

	/**
	 * Auxiliary functions
	 */

	function buildPathStringArray() {
		var result = [];
		// $log.log("_stringPath", _stringPath);
		var path = _stringPath.split("/");
		// $log.log("path", path);
		// Remove empty spaces
		path = _.filter(path, function(e) {
			return e.length > 0;
		});
		// $log.log("path", path);
		// Remove category separators
		var j = 0;
		for (i = 0; i < path.length; i++)
			if (i % 2 == 0)
				result[j++] = path[i];
		// $log.log("getPathStringArray result", result);
		return result;
	}

	return factory;
});
