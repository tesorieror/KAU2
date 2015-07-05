app.factory('categoryService', function($http, $q, $log, dataStoreService) {

	return {
	  /**
		 * State
		 */
	  categories : [],
	  categoryPath : null,
	  categoryPathSelection : null,
	  subcategories : [],
	  subcategorySelection : null,
	  chartFilter : [],

	  /**
		 * Entry Points
		 */
	  load : function(callback) {
		  $log.info(this.test = "Loading categories...");
		  var self = this;
		  dataStoreService.getDataMetadata().then(function(categoryArray) {
			  self.categories = categoryArray;
			  self.categoryPath = [ self.categories[0] ];
			  self.categoryPathSelection = self.categories[0];
			  self.subcategories = self.categories[0].children;
			  self.subcategorySelection = null;
			  $log.log("Categories loaded!");
			  if (callback != null)
				  callback(self);
		  });
	  },
	  selectCategory : function(category) {
		  var i = this.categoryPath.indexOf(category);
		  var len = this.categoryPath.length;
		  this.categoryPath.splice(i + 1, len - i - 1);
		  this.categoryPathSelection = category;
		  this.subcategorySelection = null;
		  this.subcategories = category.children;
		  this.chartFilter = this.subcategories.reduce(
		      function(prev, sc, ind, arr) {
			      prev[sc.name] = true;
			      return prev;
		      }, {});
	  },
	  selectSubcategory : function(category) {
		  this.categoryPath.push(category);
		  this.categoryPathSelection = category;
		  this.subcategories = category.children;
		  this.subcategorySelection = null;
		  this.chartFilter = this.subcategories.reduce(
		      function(prev, sc, inf, arr) {
			      prev[sc.name] = true;
			      return prev;
		      }, {});
	  },
	  getPath : function() {
		  return _.map(this.categoryPath, function(cat) {
			  return cat.name;
		  });
	  },
	  getKeys : function() {
		  var result = _reduce(this.categories, function(keyAcc, rootCat) {
			  keyAcc.concat(this.getKeysFor(rootCat));
		  }, []);
		  return result;
	  },
	  getKeysFor : function(cat) {
		  var self = this;
		  if (cat.children.length < 1)
			  return [ [ cat.name ] ];
		  else
			  return _.reduce(cat.children, function(keyList, subcat) {
				  return keyList.concat(_.map(self.getKeysFor(subcat), function(key) {
					  return [ cat.name ].concat(key);
				  }));
			  }, []);
	  },
	  getRelativeKeysForCategoryPath : function() {
	  	var self = this;
		  return _.reduce(_.last(this.categoryPath).children, function(keyAcc,
		      child) {
			  return keyAcc.concat(self.getKeysFor(child));
		  }, [])
	  },
	};
});