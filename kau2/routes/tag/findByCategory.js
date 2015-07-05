var express = require('express');
var router = express.Router();
var path = require('path');

var qu = require(path.join(__dirname, '../qu'));
var Tag = require(path.join(__dirname, '../../model/tag'));

/* GET */
router.get('/tag/category/:category', function(req, res) {
	Tag.find({
		_category : req.params.category
	}, function(err, data) {
		if (err) {
			console.error(err);
			res.send(err);
			res.status(500).end();
		} else {
			res.send(data);
			res.status(200).end();
		}
	});
});

module.exports = router;