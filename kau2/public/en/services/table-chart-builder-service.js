app.factory('tableChartBuilderService', function($http, $q, $log,
    categoryService, periodService) {

	return {
	  chart : null,

	  build : function(data) {
		  this.chart = {
		    "type" : 'Table',
		    "displayed" : true,
		    "data" : {
		      "cols" : this.buildCols(),
		      "rows" : this.buildRows(data)
		    },
		    "options" : {
		      "width" : "670",
		      "height" : "450",
		      "pageSize" : "10",
		      "page" : "enable",
		      "showRowNumber" : false,
		      "sort" : "enable"
		    }
		  };
		  return this.chart;
	  },

	  buildCols : function() {
		  return _.reduce(periodService.period, function(cols, yr) {
			  cols.push({
			    "id" : "year-" + yr,
			    "label" : yr,
			    "type" : "number",
			    "p" : {}
			  });
			  return cols;
		  }, [ {
		    "id" : "indicator",
		    "label" : "Indicator",
		    "type" : "string",
		    "p" : {},
		  } ]);

	  },

	  buildRows : function(data) {
		  var self = this;
		  return _.map(categoryService.getRelativeKeysForCategoryPath(), function(
		      key) {
			  // $log.log("Key", key);
			  return {
				  "c" : _.reduce(periodService.period, function(acc, year) {
					  acc.push({
						  "v" : self.rowValue(data[year], key)
					  });
					  return acc;
				  }, [ {
					  "v" : self.rowLabel(key)
				  } ])
			  };
		  });
	  },

	  rowValue : function(obj, key) {
		  // $log.log("Obj ",obj,"Key", key);
		  return _.reduce(key, function(acc, k) {
			  return acc[k];
		  }, obj);
	  },

	  rowLabel : function(key) {
		  // $log.log("Key", key);
		  // Get Value
		  return _.reduce(key, function(acc, k) {
			  return acc.concat(k).concat(" ");
		  }, "");
	  }
	}
});