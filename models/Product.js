var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Product Model
 * ==========
 */

var Product = new keystone.List('Product', {
	map: { name: 'name' },
	autokey: { path: 'slug', from: 'name', unique: true },
});

Product.add({
	name: { type: String, initial: true, required: true },
	publishedDate: { type: Types.Date, index: true, dependsOn: { state: 'published' } },
	image: { type: Types.CloudinaryImage },
	description: {
		brief: { type: Types.Textarea, wysiwyg: true, height: 150 },
		extended: { type: Types.Textarea, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
});

Product.schema.virtual('description.full').get(function () {
	return this.content.extended || this.content.brief;
});

Product.defaultColumns = 'name, state|20%, image|20%, ';
Product.register();
