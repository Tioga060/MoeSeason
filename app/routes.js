 // app/routes.js

// grab the nerd model we just created
var Nerd = require('./models/nerd');
var Player = require('./models/player');
var DB = require('./db.js');
var passport 	   = require('passport');
module.exports = function(app) {

	// server routes ===========================================================
	// handle things like api calls
	// authentication routes

	// sample api route
	app.get('/api/nerds', function(req, res) {
		// use mongoose to get all nerds in the database
		Nerd.find(function(err, nerds) {

			// if there is an error retrieving, send the error. 
							// nothing after res.send(err) will execute
			if (err)
				res.send(err);

			res.json(nerds); // return all nerds in JSON format
		});
	});

	app.get('/auth/wargaming',
	passport.authenticate('openid'));
	
	app.post('/auth/wargaming',
	passport.authenticate('openid'));

	app.get('/auth/wargaming/return', 
		passport.authenticate('openid',{successRedirect: '/success',failureRedirect: '/error'}), 
		function(req, res) {
			//res.sendfile('./public/views/player.html');
			//console.log("neat");
		}
	);
	
	app.get('/success', function(req, res, next) {
		//console.log(req.cookies);
		DB.insertAndGet(DB.getPlayerInfo(req.user),req.cookies, function(err, result){});
		next();
		res.redirect('/');
	});

	app.get('/profile/*', function(req, res) {
		res.sendfile('./public/views/index.html');
	});
	app.get('/error', function(req, res, next) {
	  res.send("Error logging in.");
	  
	});
	
	//app.get('/player/:playerid', function(req, res) {
	//	res.send(req.params.playerid);
	//});
	
	
	
	// route to handle creating goes here (app.post)
	// route to handle delete goes here (app.delete)

	// frontend routes =========================================================
	// route to handle all angular requests
	app.get('/', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
		/*if(req.user){
			//console.log("this is what i got for you");
			DB.insertAndGet(DB.getPlayerInfo(req.user),req.cookies, function(err, result){
				req.user = (result);
				//console.log(req.user);
			});
		}*/
	});
	
	app.get('/players', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
	
	app.get('/tanks', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
	app.get('/tanks/*', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
	
	app.get('/rules', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
	
	app.get('/player/:playerid', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
	});
	
	//Handle 404's here ========================================================= =========================================================
	app.get('/:test', function(req, res) {
		res.sendfile('./public/index.html'); // load our public/index.html file
		/*if(req.user){
			//console.log("this is what i got for you");
			DB.insertAndGet(DB.getPlayerInfo(req.user),req.cookies, function(err, result){
				req.user = (result);
				//console.log(req.user);
			});
		}*/
	});

};
