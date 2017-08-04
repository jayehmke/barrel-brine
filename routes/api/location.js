const async = require('async');
const keystone = require('keystone');

const Location = keystone.list('Location');
const Category = keystone.list('ProductCategory');

exports.options = function (req, res) {
	res.send({
		success: true
	});
};

/**
 * List Locations
 */


function getHomeCoords(coordinates) {

	return new Promise(function (res, rej) {

		if (coordinates) {
			try {
				console.log(JSON.parse(coordinates))
				const coords = JSON.parse(coordinates);
				res([
					coords.lng,
					coords.lat
				])
			} catch (e) {
				rej(e);
			}

		} else {
			try {
				Location.model.findOne()
					.where('name', 'Barrel + Brine')
					.exec(function (err, item) {

						if (err) console.log(err);
						
						try {
							res(item.address.geo);
						} catch(e) {
							res(null)
						}

						
					})
			} catch(e) {
				res({locations: []})
			}
			
		}

	})

}

exports.list = function (req, res) {

	const categories = req.query.categories;
	const coordinateJson = req.query.coordinates;
	const coordinates = getHomeCoords(coordinateJson);
	const range = req.query.range || 5000;
	
	coordinates
		.then(function (coords) {

			const query = Location.model.find({
					"address.geo": {
						$near: {
							$geometry: { type: "Point", coordinates: coords },
							$maxDistance: range * 1609.34
						}
					}
				}
			);
			if (categories) {
				const categoryIds = categories.split(',').filter(String);
				query
					.where('categories')
					.all(categoryIds)
					.exec(function (err, items) {
						if (err) {
							console.log(err);
							return false
						}
						return res.send({
							locations: items,
						});
					});
			}
			else {
				query
					.exec(function (err, items) {
						if (err) return res.send('database error', err);
						res.send({
							locations: items,
						});
					});
			}
		})
	;

}
;

/**
 * Get Location by ID
 */
exports.get = function (req, res) {

	Location.model.findOne({
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
						.where('location', item.id)
						.where('startDate', { $lt: Date.now() })
						.where('endDate', { $gt: Date.now() })
						.exec(function (err, events) {

							callback(null, events);

						});
				},
				awards: function (callback) {
					Award.model.find()
						.where('location', item.id)
						.exec(function (err, awards) {

							callback(null, awards);

						});
				},
			}, function (err, results) {
				res.send({
					location: item,
					events: results.events,
					awards: results.awards,
				});
			});

		});
}

/**
 * Create a Location
 */
exports.create = function (req, res) {

	const item = new Location.model();
	const data = (req.method == 'POST') ? req.body : req.query;

	item.getUpdateHandler(req).process(data, function (err) {

		if (err) return res.apiError('error', err);

		res.apiResponse({
			location: item
		});

	});
}

/**
 * Get Location by ID
 */
exports.update = function (req, res) {
	Location.model.findById(req.params.id).exec(function (err, item) {

		if (err) return res.apiError('database error', err);
		if (!item) return res.apiError('not found');

		const data = (req.method === 'POST') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function (err) {

			if (err) return res.apiError('create error', err);

			res.apiResponse({
				location: item
			});

		});

	});
}

/**
 * Delete Location by ID
 */
exports.remove = function (req, res) {
	Location.model.findById(req.params.id).exec(function (err, item) {

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
