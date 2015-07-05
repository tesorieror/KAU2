function Period(years) {
	this.years = years;
	this.toYear = years[0];
	this.fromYear = years[years.length - 1];

	this.getPeriod = function() {
		var start = this.years.indexOf(this.toYear);
		var end = this.years.indexOf(this.fromYear) + 1;
		var answer = this.years.slice(start, end);
		return answer;
	};
}