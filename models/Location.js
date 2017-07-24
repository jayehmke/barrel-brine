var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Location Model
 * ==========
 */

var Location = new keystone.List('Location', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'name', unique: true },
});

Location.add({
	name: { type: String, required: true, initial: true },
	image: { type: Types.CloudinaryImage },
	address: { type: Types.Location, required: true, initial: true },
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
});

Location.defaultColumns = 'name|20%';
Location.register();
