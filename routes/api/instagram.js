const async = require('async');
var ig = require('instagram-node').instagram();

exports.options = function (req, res) {
	res.send({
		success: true
	});
};

/**
 * List Product
 */
exports.list = function (req, res) {


	ig.use({ access_token: '2313350488.2407398.05ab8e304fba45f99b1f4fbce58df698' });


	ig.user_media_recent('2313350488', [], function(err, medias, pagination, remaining, limit) {

		if (err) return res.send('database error', err);

		res.send({
			photos: medias,
		});

	});
	
};







