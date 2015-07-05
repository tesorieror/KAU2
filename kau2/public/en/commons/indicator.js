/**
 * New node file
 */

function Indicator(pathString) {

	this.categorySeparators = [];
	this.categorySeparators[1] = 'category';
	this.categorySeparators[3] = 'subcategory';
	this.categorySeparators[5] = 'subsubcategory';
	this.categorySeparators[7] = 'subsubsubcategory';
	this.categorySeparators[9] = 'subsubsubsubcategory';

	this.path = [];

	// this.root = null;
	// this.category = null;
	// this.subcategory = null;
	// this.subsubcategory = null;
	// this.subsubsubcategory = null;
	// this.subsubsubsubcategory = null;

	this.setPathString(pathString);
};

Indicator.prototype.setPathString = function(pathString) {
	this.path = pathString.split("/");
	this.path = _.filter(this.path, function(e) {
		return e.length > 0;
	});
	// this.root = this.path[0];
	// this.category = this.path[2];
	// this.subcategory = this.path[4];
	// this.subsubcategory = this.path[6];
	// this.subsubsubcategory = this.path[8];
	// this.subsubsubsubcategory = this.path[10];
};

Indicator.prototype.getPathString = function() {
	var result = '/'.concat(this.path[0] ? this.path[0].concat('/') : '');
	for (i = 2; i < this.path.length; i = i + 2) {
		result = result.concat(this.path[i] ? this.path[i - 1].concat('/').concat(
		    this.path[i]).concat('/') : '');
	}
	return result;
};
