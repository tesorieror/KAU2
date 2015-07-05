/**
 * Tag Category file
 */
var path = require('path');
var mongoose = require('mongoose');
var q = require('q');
var _ = require('underscore');

var TagCategory;

var schema = mongoose.Schema({
	name : String,
	description : String,
	order: Number
});

schema.statics.promRemoveAll = function() {
	var deferred = q.defer();
	TagCategory.remove(function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

schema.statics.promFindAll = function() {
	var deferred = q.defer();
	TagCategory.find(function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

schema.statics.promInsertPlain = function(plainTagCategory) {
	var tagCategory = new TagCategory(plainTagCategory);
	return tagCategory.promSave();
};

schema.statics.promInsertPlainAll = function(tagCategories) {
	console.log('Tag Categories', tagCategories);
	var inserts = _.map(tagCategories, function(plainTagCategory) {
		return TagCategory.promInsertPlain(plainTagCategory);
	});
	return q.all(inserts);
};

schema.statics.promFindByName = function(name) {
	var deferred = q.defer();
	this.findOne({
		name : name
	}, function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

schema.methods.promSave = function() {
	var deferred = q.defer();
	this.save(function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

module.exports = TagCategory = mongoose.model('TagCategory', schema);