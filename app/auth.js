var passport 	   = require('passport');
var WargamingStrategy = require('passport-openid').Strategy;

module.exports = function(app) {

	passport.use(new WargamingStrategy({
			returnURL: 'http://138.68.51.145:8080/auth/wargaming/return',
			realm: 'http://138.68.51.145:8080/',
			providerURL: 'https://na.wargaming.net/id'
		},
		function(identifier, done) {
			done(null, identifier);
	  }
  
	));
	
	passport.serializeUser(function(user, done) {
	  done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
	  done(null, obj);
	});
	
	
};

