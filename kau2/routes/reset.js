var express = require('express');
var router = express.Router();
var q = require('q');
var qu = require('./qu');
var _ = require('underscore');
var fs = require('fs');

var TagCategory = require("../model/tag-category");

function findAll(data, err) {
	return q.ninvoke(TagCategory, 'find');
}

function insertTagCategory(tc) {
	var tagCategory = new TagCategory(tc);
	return q.ninvoke(tagCategory, 'save');
}

function insertTagCategories(data, err) {
	var inserts = _.map(data, function(tc) {
		return insertTagCategory(tc);
	});
	return q.all(inserts);
}

function removeAllTagCategories() {
	var deferred = q.defer();
	TagCategory.remove(function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
}
// 
function readFile(f) {
	return function(data, err) {
		return q.nfcall(fs.readFile, f, 'utf-8');
	};
}

/* GET users listing. */
router.get('/', function(req, res) {
	// readFile('../data/tag-category.json')().then(qu.showData()).then(
	// qu.sendData(res)).fail(qu.sendError(res)).done();
	removeAllTagCategories()//
	.then(readFile('../data/tag-category.json'))
	// .then(qu.showData()) //
	.then(qu.toJSON) //
	.then(insertTagCategories) //
	.then(findAll)//
	.then(qu.sendData(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;