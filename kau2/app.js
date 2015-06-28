var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var database = require('./config/database');

var routes = require('./routes/index');
var users = require('./routes/users');
var uploadForm = require('./routes/uploadForm');

// Tag Category
var resetTagCategory = require('./routes/tagCategory/reset');
var removeAllTagCategory = require('./routes/tagCategory/removeAll');
var findAllTagCategory = require('./routes/tagCategory/findAll');
var insertAllTagCategory = require('./routes/tagCategory/insertAll');

// Tag
var resetTag = require('./routes/tag/reset');
var removeAllTag = require('./routes/tag/removeAll');
var findAllTag = require('./routes/tag/findAll');
var insertAllTag = require('./routes/tag/insertAll');
var findPlainTag = require('./routes/tag/findPlain');

//Indicator
var resetIndicator = require('./routes/indicator/reset');
var removeAllIndicator = require('./routes/indicator/removeAll');
var findAllIndicator = require('./routes/indicator/findAll');
var insertAllIndicator = require('./routes/indicator/insertAll');
var findPlainIndicator = require('./routes/indicator/findPlain');
var insertPlainIndicator = require('./routes/indicator/insertPlain');

var app = express();

// DB
mongoose.connect(database.url);
var db = mongoose.connection;
app.set('db', db);
db.on('error', console.error.bind(console, 'connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
// app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended : false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/uploadForm', uploadForm);

// Tag Category
app.use('/tagCategory/reset', resetTagCategory);
app.use('/tagCategory/removeAll', removeAllTagCategory);
app.use('/tagCategory/findAll', findAllTagCategory);
app.use('/tagCategory/insertAll', insertAllTagCategory);

// Tag
app.use('/tag/reset', resetTag);
app.use('/tag/removeAll', removeAllTag);
app.use('/tag/findAll', findAllTag);
app.use('/tag/findPlain', findPlainTag);
app.use('/tag/insertAll', insertAllTag);


//Indicator
app.use('/indicator/reset', resetIndicator);
app.use('/indicator/removeAll', removeAllIndicator);
app.use('/indicator/findAll', findAllIndicator);
app.use('/indicator/findPlain', findPlainIndicator);
app.use('/indicator/insertAll', insertAllIndicator);
app.use('/indicator/insertPlain', insertPlainIndicator);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	var err = new Error('Not Found');
	err.status = 404;
	next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
	app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
			message : err.message,
			error : err
		});
	});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.render('error', {
		message : err.message,
		error : {}
	});
});

module.exports = app;
