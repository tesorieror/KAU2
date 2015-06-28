module.exports = {};
var fs = require('fs');
var q = require('q');

module.exports.sendData = function(res) {
	return function(data, err) {
		res.send(data + "");
		res.status(200).end();
		return data;
	};
};

module.exports.sendError = function(res) {
	return function(err) {
		console.error(err);
		res.send("" + err);
		res.status(500).end();
		throw err;
	};
};

module.exports.showData = function() {
	return function(data, err) {
		console.log(data);
		return data;
	};
};

module.exports.myError = function(data, err) {
	throw new Error("My Error!");
	// return data;
};

module.exports.toJSON = function(data, err) {
	// console.log("JSON data", data);
	return JSON.parse(data);
};

module.exports.promLoadFile = function(file) {
	var deferred = q.defer();
	fs.readFile(file, 'utf-8', function(err, data) {
		if (err) {
			deferred.reject(err);
		} else {
			deferred.resolve(data);
		}
	});
	return deferred.promise;
};
