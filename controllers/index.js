module.exports = function(app) {
	var Projects = require('../models/projects.js'),
		db = app.db,
		context = {};


	app.get('/', function(req, res) {
		Projects.all(db, function(documents) { // query db

			// sort results
			documents.sort(function(a, b) {
				var result = a.sort > b.sort ? 1 : -1;
				return result;
			});

			context.projects = documents;

			res.render('home', context); // render view
		});
	});

	app.get('/blog', function(req, res) {
		context.header = 'Returning soon.';
		context.body = 'Go back to <a href="/">home</a>.';

		res.render('message', context);
	});
}