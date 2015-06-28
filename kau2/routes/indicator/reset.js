var express = require('express');
var router = express.Router();
var path = require('path');
var q = require('q');
var qu = require('../qu');
var _ = require('underscore');
var fs = require('fs');

var Indicator = require("../../model/indicator");

var reseting = false;

function loadFile(file) {
	return function(data, err) {
		return qu.promLoadFile(file);
	};
}

router.get('/', function(req, res) {
	if (reseting) {
		res.send("Already reseting, try later");
		res.status(200).end();
		return;
	}

	reseting = true;
	Indicator.promRemoveAll()
			// Remove all
			.then(
					loadFile(path.join(__dirname,
							'../../data/1434-1435-indicator.json')))// Load file
			.then(qu.toJSON)// Convert to JSON
			.then(qu.showData(res))//
			.then(Indicator.promInsertPlainAll) // Insert All
			.then(Indicator.promCount)//
			.then(qu.sendData(res))//
			.fail(qu.sendError(res))//
			.then(function(data, err) {
				reseting = false;
				return q(data);
			}).done();
});

module.exports = router;