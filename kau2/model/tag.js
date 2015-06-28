/**
 * Tag file
 */
var path = require('path');
var mongoose = require('mongoose');
var q = require('q');
var _ = require('underscore');

var qu = require(path.join(__dirname, '../routes/qu'));

var TagCategory = require(path.join(__dirname, 'tag-category'));

var schema = mongoose.Schema({
	name : String,
	description : String,
	_category : mongoose.Schema.Types.ObjectId
});

var Tag;

schema.statics.promRemoveAll = function() {
	var deferred = q.defer();
	Tag.remove(function(err, data) {
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
	Tag.find(function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

schema.statics.promFindPlain = function(plainTag) {

	function promReplaceCategory(plainTag) {
		return function(data, err) {
			var deferred2 = q.defer();
			delete plainTag.category;
			plainTag._category = data;
			if (err) {
				deferred2.reject(err);
			} else {
				deferred2.resolve(plainTag);
			}
			return deferred2.promise;
		};
	}

	function processPromise(data, err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	}


	var deferred = q.defer();
	TagCategory.promFindByName(plainTag.category)//
	.then(promReplaceCategory(plainTag))//
	.then(Tag.promFind) //
	.then(processPromise) //
	.done();
	return deferred.promise;
};

schema.statics.promFind = function(t) {
	var deferred = q.defer();
	Tag.find(t, function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};

schema.statics.promInsertPlain = function(plainTag) {
	return TagCategory.promFindByName(plainTag.category)//
	.then(function(category, err) {
		delete plainTag.category;
		plainTag._category = category;
		var tag = new Tag(plainTag);
		return tag.promSave();
	})//
	.done();
};

schema.statics.promInsertPlainAll = function(tags) {
	var inserts = _.map(tags, function(plainTag) {
		return Tag.promInsertPlain(plainTag);
	});
	return q.all(inserts);
};

schema.statics.promCount = function() {
	var deferred = q.defer();
	Tag.count(function(err, data) {
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

module.exports = Tag = mongoose.model('Tag', schema);