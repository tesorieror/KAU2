var express = require('express');
var router = express.Router();
var path = require('path');
var q = require('q');
var _ = require('underscore');
var fs = require('fs');

var qu = require(path.join(__dirname, '../qu'));
var Tag = require(path.join(__dirname, '../../model/tag'));
var Indicator = require(path.join(__dirname, '../../model/indicator'));

function sendResults(res) {
	return function(data, err) {
		console.log("Results", data);
		res.send(data + ' indicator loaded');
		res.status(200).end();
	};
}

/* GET */
router.get('/', function(req, res) {

	var indicator = {
		"tags" : [ {
			"category" : "YR",
			"name" : "1434-1435"
		}, {
			"category" : "IT",
			"name" : "PU"
		}, {
			"category" : "SS",
			"name" : "FR"
		}, {
			"category" : "GR",
			"name" : "DA"
		}, {
			"category" : "NA",
			"name" : "SA"
		}, {
			"category" : "GE",
			"name" : "MA"
		} ],
		"value" : 11193
	};
	
	q(indicator)//
	.then(Indicator.promInsertPlain)//
	.then(sendResults(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;
