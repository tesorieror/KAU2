/**
 * New node file
 */

app.factory('periodService', function($http, $q, $log, dataStoreService) {

	return {
	  /**
		 * State
		 */
	  years : [],
	  from : null,
	  to : null,
	  period : [],
	  /**
		 * 
		 */

	  load : function(callback) {
		  $log.info("Loading years...");
		  var self = this;
		  dataStoreService.getYears().then(function(years) {
			  self.years = years;
			  self.from = self.years[self.years.length - 1];
			  self.to = self.years[0];
			  self.years = self.years.slice(0);
			  self.period = self.years;
			  $log.info("Years loaded", years);
		  });
	  },

	  update : function() {
		  $log.info("[Period Service] Update.");
		  this.period = this.years.slice(this.years.indexOf(this.to), this.years
		      .indexOf(this.from) + 1);
	  }

	}
});