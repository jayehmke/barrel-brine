var ig = require('instagram-node').instagram();

// Every call to `ig.use()` overrides the `client_id/client_secret` 
// or `access_token` previously entered if they exist. 
// ig.use({ access_token: 'YOUR_ACCESS_TOKEN' });
ig.use({ access_token: '35016196.a66e464.149607b41fa047b3a9984eb8fda7ca2f' });


ig.user_media_recent('35016196', [], function(err, medias, pagination, remaining, limit) {
	
	if (err) console.log('err', err);
	
	
	console.log('media', medias)
	
});

