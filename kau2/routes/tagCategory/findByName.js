var express = require('express');
var router = express.Router();
var path = require('path');

var qu = require(path.join(__dirname, '../qu'));
var TagCategory = require(path.join(__dirname, '../../model/tag-category'));

/* GET */
router.get('/tagCategory/name/:name', function(req, res) {
	TagCategory.find({
		name : req.params.name
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