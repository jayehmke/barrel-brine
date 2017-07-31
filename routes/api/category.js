const async = require('async');
const keystone = require('keystone');

const ProductCategory = keystone.list('ProductCategory');
const Product = keystone.list('Product');

exports.options = function (req, res) {
	res.send({
		success: true
	});
};

/**
 * List ProductCategory
 */
exports.list = function (req, res) {
	ProductCategory.model.find()
		.exec(function (err, items) {

			if (err) return res.send('database error', err);

			res.send({
				categories: items,
			});

		});
};

exports.listWithProducts = function (req, res) {
	ProductCategory.model.find()
		.exec(function (err, categories) {

			keystone.populateRelated(categories, 'products', function (err) {
				// ... you have categories with posts
				if (err) return res.send('database error', err);
				// console.log('catz', categories)
				const newArray = categories.map(function (category) {
					return {
						category: category,
						products: category.products,
					}
				})

				res.send({
					categories: newArray
				})

			});

		});
};

/**
 * Get ProductCategory by ID
 */
exports.get = function (req, res) {

	ProductCategory.model.findOne({
		lookupSlug: req.params.id,
	})
		.populate('departments')
		.deepPopulate('departments.employees')
		.exec(function (err, item) {

			if (err) return res.send('database error', err);
			if (!item) return res.send('not found');

			async.parallel({
				events: function (callback) {
					Event.model.find()
						.where('productCategory', item.id)
						.where('startDate', { $lt: Date.now() })
						.where('endDate', { $gt: Date.now() })
						.exec(function (err, events) {

							callback(null, events);

						});
				},
				awards: function (callback) {
					Award.model.find()
						.where('productCategory', item.id)
						.exec(function (err, awards) {

							callback(null, awards);

						});
				},
			}, function (err, results) {
				res.send({
					productCategory: item,
					events: results.events,
					awards: results.awards,
				});
			});

		});
}

/**
 * Create a ProductCategory
 */
exports.create = function (req, res) {

	const item = new ProductCategory.model();
	const data = (req.method == 'POST') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function (err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			productCategory: item
		});

	});
}

/**
 * Get ProductCategory by ID
 */
exports.update = function (req, res) {
	ProductCategory.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		const data = (req.method === 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function (err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				productCategory: item
			});

		});

	});
}

/**
 * Delete ProductCategory by ID
 */
exports.remove = function (req, res) {
	ProductCategory.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		item.remove(function (err) {
			if (err) return res.apiError('database error', err);

			return res.apiResponse({
				success: true
			});
		});

	});
}
