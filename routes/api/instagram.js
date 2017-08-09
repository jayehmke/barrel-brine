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


	ig.use({ access_token: '35016196.a66e464.149607b41fa047b3a9984eb8fda7ca2f' });


	ig.user_media_recent('35016196', [], function(err, medias, pagination, remaining, limit) {

		if (err) return res.send('database error', err);

		res.send({
			photos: medias,
		});

	});
	
};







