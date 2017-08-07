const async = require('async');
const keystone = require('keystone');

const Banner = keystone.list('Banner');

exports.options = function (req, res) {
	res.send({
		success: true
	});
};

/**
 * List Banner
 */
exports.list = function (req, res) {
	Banner.model.find()
		.exec(function (err, items) {

			if (err) return res.send('database error', err);

			res.send({
				banners: items,
			});

		});
};

