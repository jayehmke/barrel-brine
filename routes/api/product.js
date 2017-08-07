const async = require('async');
const keystone = require('keystone');

const Product = keystone.list('Product');

exports.options = function (req, res) {
	res.send({
		success: true
	});
};

/**
 * List Product
 */
exports.list = function (req, res) {
	Product.model.find()
		.exec(function (err, items) {

			if (err) return res.send('database error', err);

			res.send({
				products: items,
			});

		});
};

