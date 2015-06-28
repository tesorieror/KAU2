var express = require('express');
var router = express.Router();
var path = require('path');
var q = require('q');
var qu = require('../qu');
var _ = require('underscore');
var fs = require('fs');

var TagCategory = require("../../model/tag-category");

function loadFile(file) {
	return function(data, err) {
		return qu.promLoadFile(file);
	};
}

router.get('/', function(req, res) {
	TagCategory.promRemoveAll()// Remove all
	.then(loadFile(path.join(__dirname, '../../data/tag-category.json')))// Load file
	.then(qu.toJSON)// Convert to JSON
	.then(qu.showData(res))//
	.then(TagCategory.promInsertPlainAll) // Insert All
	.then(TagCategory.promFindAll)//
	.then(qu.sendData(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;