var express = require('express'),
	expresshbs = require('express-handlebars'),
	mongodb = require('mongodb'),
	sass = require('node-sass-middleware'),
	path = require('path'),
	config = require('./config.js'),
	controllers = require('./controllers/index.js'),
	app = express(); // instantiate application

// database connection
mongodb.MongoClient.connect(config.dbUri, function(err, db) {
	if (err) {
		console.log('error connecting to the db');
	} else {
		app.db = db; // save db connection
		app.listen(3737);
		addMiddleware();
	}
});

function addMiddleware() {
	// views
	app.engine('handlebars', expresshbs({ defaultLayout: 'main' }));
	app.set('view engine', 'handlebars');

	app.use(express.static('public'));

	controllers(app); // route to controllers

	// error handling
	app.use(function(req, res) {
		res.render('404');
	});

	app.use(function(error, req, res, next) {
		console.log(error);

		var context = {
			header : "500.",
			body : "We've encountered some server difficulties. Please try again later."
		};

		res.render('message', context);
	});
}	