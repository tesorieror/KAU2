var express = require('express');
var router = express.Router();
var path = require('path');
var q = require('q');
var qu = require('../qu');
var _ = require('underscore');
var fs = require('fs');

var Tag = require("../../model/tag");

function loadFile(file) {
	return function(data, err) {
		return qu.promLoadFile(file);
	};
}

router.get('/', function(req, res) {
	Tag.promRemoveAll()// Remove all
	.then(loadFile(path.join(__dirname, '../../data/tag.json')))// Load file
	.then(qu.toJSON)// Convert to JSON
	.then(qu.showData(res))//
	.then(Tag.promInsertPlainAll) // Insert All
	.then(Tag.promFindAll)//
	.then(qu.sendData(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;