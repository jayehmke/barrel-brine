var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Banner Model
 * =============
 */

var Banner = new keystone.List('Banner', {
	autokey: { from: 'name', path: 'key', unique: true },
});

Banner.add({
	name: { type: Types.Text, required: true, initial: true, },
	publishedDate: { type: Date, default: Date.now },
	image: { type: Types.CloudinaryImage, required: true, initial: true, },
	sortOrder: { type: Types.Number },
	isActive: { type: Types.Boolean }
});

Banner.register();
	
