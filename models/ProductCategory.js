var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * PostCategory Model
 * ==================
 */

var ProductCategory = new keystone.List('ProductCategory', {
	autokey: { from: 'name', path: 'key', unique: true },
});

ProductCategory.add({
	name: { type: Types.Text, required: true },
	icon: { type: Types.Select, options: 'pickle, on-tap, bottled', initial: true, required: true },
});

ProductCategory.relationship({ ref: 'Product', path: 'products', refPath: 'categories' });

ProductCategory.register();
