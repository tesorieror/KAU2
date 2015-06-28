var express = require('express');
var router = express.Router();
var path = require('path');

var qu = require(path.join(__dirname, '../qu'));
var Indicator = require(path.join(__dirname, '../../model/indicator'));

function showResults(res) {
	return function(data, err) {
		// console.log("Results", data);
		res.send("" + data.length);
		res.status(200).end();
	};
}

/* GET */
router.get('/', function(req, res) {
	Indicator.promFindPlain({
		// value : 6137
		tags : [ //
		{
			name : 'TO',
			category : 'GE'
		}, //
		{
			name : 'SA',
			category : 'NA'
		}, //
		{
			name : 'MA',
			category : 'GR'
		}, //
		{
			name : 'FR',
			category : 'SS'
		}, //
		{
			name : 'PUC',
			category : 'IT'
		}, //
		{
			name : '1434-1435',
			category : 'YR'
		} //
		]
	})//
	// Tag.promFindAll()//
	.then(showResults(res))//
	.fail(qu.sendError(res))//
	.done();
});

module.exports = router;