function all(db, callback) {

	db.collection('projects', function(err, collection) {
		collection.find().toArray(function(err, documents) {

			if (err) {
				console.log(err);
				return;
			}

			callback(documents);
		});
	});

}

exports.all = all;