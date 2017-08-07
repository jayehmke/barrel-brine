var keystone = require('keystone');
var Types = keystone.Field.Types;

/**
 * Faq Model
 * ==========
 */

var Faq = new keystone.List('Faq', {
	map: { name: 'title' },
	autokey: { path: 'slug', from: 'name', unique: true },
});

Faq.add({
	title: { type: Types.Text, required: true, initial: true },
	answer: { type: Types.Textarea, required: true, initial: true },
});

Faq.defaultColumns = 'title|20%';
Faq.register();
