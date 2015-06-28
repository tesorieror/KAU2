var express = require('express');
var router = express.Router();
var q = require('q');
var fs = require('fs');

var TagCategory = require("../model/tag-category");

function sendData(res) {
	return function(data, err) {
		res.send(data);
		res.status(200).end();
		return data;
	};
}

function sendError(res) {
	return function(err) {
		console.error(err);
		res.send("" + err);
		res.status(500).end();
		throw err;
	};
}

function showData() {
	return function(data, err) {
		console.log(data);
		return data;
	};
}

function myError(data, err) {
	throw new Error("My Error!");
	// return data;
}

/* GET users listing. */
router.get('/', function(req, res) {

	q.nfcall(fs.readFile, '../data/tag-category.json', 'utf8').then(showData())
			.then(myError)
			// .then(sendData(res))
			.fail(sendError(res)).done();

});

function findAll(data, err) {
	return q.ninvoke(TagCategory, 'find');
}

module.exports = router;