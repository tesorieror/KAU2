/**
 * Tag file
 */
var path = require('path');
var mongoose = require('mongoose');
var q = require('q');
var _ = require('underscore');

var Tag = require(path.join(__dirname, 'tag'));
var Indicator = require(path.join(__dirname, 'indicator'));

var schema = mongoose.Schema({
	value : Number,
	_tags : [ {
		type : mongoose.Schema.Types.ObjectId,
		ref : 'Tag'
	} ]
});

var Indicator;

schema.statics.promRemoveAll = function() {
	var deferred = q.defer();
	Indicator.remove(function(err, data) {
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
	Indicator.find(function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {

			Tag.populate(data, {
				path : '_tags'
			}, function(err, data) {
				if (err) {
					deferred.reject(err);
				} else {
					console.log("Indicators", data);
					deferred.resolve(data);
				}

			});

		}
	});
	return deferred.promise;
};

schema.statics.promFindPlain = function(plainIndicator) {
	var deferred = q.defer();
	var promises = _.map(plainIndicator.tags, function(plainTag) {
		return Tag.promFindPlain(plainTag);
	});

	q.all(promises)//
	.then(function(data, err) {
		var deferred = q.defer();
		if (data.length > 0) {
			plainIndicator._tags = {
				$all : _.flatten(data)
			};
			delete plainIndicator.tags;
		}

		console.log("PI2", plainIndicator);

		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(plainIndicator);
		}
		return deferred.promise;
	})//
	.then(function(data, err) {
		Indicator.find(data, function(err, data) {
			if (err) {
				deferred.reject(err);
			} else {
				deferred.resolve(data);
			}
		});
	})//
	.done();//
	return deferred.promise;
};

schema.statics.promInsertPlain = function(plainIndicator) {

	var promises = _.map(plainIndicator.tags, function(plainTag) {
		return Tag.promFindPlain(plainTag);
	});

	var deferred = q.defer();
	q.all(promises)//
	.then(function(data, err) {
		var deferred = q.defer();
		plainIndicator._tags = _.flatten(data);
		delete plainIndicator.tags;
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(plainIndicator);
		}
		return deferred.promise;
	})//
	.then(function(data, err) {
		var indicator = new Indicator(data);
		return indicator.promSave();
	})//
	.then(function(data, err) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	})//
	.done();
	return deferred.promise;
};

schema.statics.promInsertPlainAll = function(indicators) {
	var inserts = _.map(indicators, function(plainIndicator) {
		return Indicator.promInsertPlain(plainIndicator);
	});
	return q.all(inserts);
};

schema.statics.promCount = function() {
	var deferred = q.defer();
	Indicator.count(function(err, data) {
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

module.exports = Indicator = mongoose.model('Indicator', schema);