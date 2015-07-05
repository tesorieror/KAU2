var express = require('express');
var router = express.Router();
var path = require('path');
var _ = require('underscore');
var q = require('q');

var qu = require(path.join(__dirname, '../qu'));
var Indicator = require(path.join(__dirname, '../../model/indicator'));
var Tag = require(path.join(__dirname, '../../model/tag'));

/* GET */
router.get('/indicator/tags/:tags', function(req, res) {

	var tags = req.params.tags.split(',');
	Indicator.find({
		_tags : {
			$all : tags
		}
	}, function(err, data) {
		if (err) {
			console.error(err);
			res.send(err);
			res.status(500).end();
		} else {
			var promises = [];
			_.each(data, function(indicator) {
				// console.log("Plain", indicator);
				// console.log("Plain Tags", indicator._tags);
				promises.push(Tag.populate(data, {
					path : '_tags'
				}));
			});
			q.all(promises).then(function(data, err) {
//				console.log("Populated", data);
				res.send(data);
				res.status(200).end();
			});
		}
	});
});

module.exports = router;