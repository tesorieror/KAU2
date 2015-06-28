var express = require('express');
var router = express.Router();
var path = require('path');

var qu = require(path.join(__dirname, '../qu'));
var Indicator = require(path.join(__dirname, '../../model/indicator'));

function showResults(res) {
	return function(data, err) {
		res.send(data);
		res.status(200).end();
	};
}

/* GET */
router.get('/', function(req, res) {
	Indicator.promRemoveAll()//
	.then(showResults(res))
	// .then(qu.sendData(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;