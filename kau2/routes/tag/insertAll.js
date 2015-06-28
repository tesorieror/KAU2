var express = require('express');
var router = express.Router();
var path = require('path');
var q = require('q');
var _ = require('underscore');
var fs = require('fs');

var qu = require(path.join(__dirname, '../qu'));
var Tag = require(path.join(__dirname, '../../model/tag'));
var TagCategory = require(path.join(__dirname, '../../model/tag-category'));

function sendResults(res) {
	return function(data, err) {
		res.send(data.length + ' tags loaded');
		res.status(200).end();
	};
}

/* GET */
router.get('/', function(req, res) {
	q.nfcall(fs.readFile, path.join(__dirname, '../../data/tag.json'), 'utf-8')//
	.then(qu.toJSON)//
	.then(Tag.promInsertPlainAll)//
	.then(sendResults(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;
