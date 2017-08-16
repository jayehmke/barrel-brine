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
	image: { 
		thumbnail: { type: Types.Url, hidden: true },
		full: { type: Types.CloudinaryImage, autoCleanup: true }
	},
	description: {
		brief: { type: Types.Textarea, wysiwyg: true, height: 150 },
		extended: { type: Types.Textarea, wysiwyg: true, height: 400 },
	},
	categories: { type: Types.Relationship, ref: 'ProductCategory', many: true },
});

Product.schema.virtual('description.full').get(function () {
	return this.content.extended || this.content.brief;
});

Product.schema.pre('save', function(next) {
	this.image.thumbnail = this._.image.full.thumbnail(400,300,{ quality: 60 });
	// this.image.full = this._.image.thumbnail(640,640,{ quality: 60 });
	// this.lastModified = Date.now();
	next();
});

Product.defaultColumns = 'name, state|20%, image.thumbnail|20%, ';
Product.register();
