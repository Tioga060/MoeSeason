var express= require('express');
var router = express.Router();              // get an instance of the express Router
var Player = require('../models/player');
var Tank = require('../models/tank');
var wgapi = require('../wgapi');
var DB = require('../db.js');
var stats = require('../stats.js');
var variables = require('../variables');

module.exports = function(app) {
	
	
	// middleware to use for all requests
	router.use(function(req, res, next) {
		// do logging
		//console.log('Something is happening.');
		next(); // make sure we go to the next routes and don't stop here
	});

	
	// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
	router.get('/', function(req, res) {
		res.json({ message: 'hooray! welcome to our api!' });   
	});

	// more routes for our API will happen here
	router.route('/player')

		// create a player (accessed at POST http://localhost:8080/api/player)
		/*.post(function(req, res) {
			
			var player = new Player();      // create a new instance of the Bear model
			//console.log("Got username: "+req.body.username);
			player.username = req.body.username;  // set the bears name (comes from the request)
			player.playerid = req.body.playerid;
			player.server = req.body.server;
			player.setStartingStats();
			
			res.json({ message: 'Player created!' });
			
		})*/
		
		 // get all the bears (accessed at GET http://localhost:8080/api/bears)
		.get(function(req, res) {
			Player.find({},'playerid username moescores.totalScore',function(err, players) {//playerid username session_data
				if (err)
					res.send(err);
				res.json(players);
			});
		});
	
	router.route('/player/:playerid')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		Player.findOne({ 'playerid': req.params.playerid },'-cookie', function (err, person) {
			if (err)
				res.send(err);
			//Return Player
			//console.log("Player gotten "+req.params.playerid);
			res.json(person);
		});
    });
	
	router.route('/player/update/:playerid')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		DB.updateSession(req.params.playerid, function(err, result){
			res.json(result);
		});
	});
	
	router.route('/sessions')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		Tank.find({'sessions': {$exists: true}},function(err, tanks) {//playerid username session_data
			if (err)
				res.send(err);
			res.json(tanks);
		});
	});
	
	router.route('/scores')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		stats.calculateMoeScores(function(data){
			res.json(data);
		});
	});
	
	router.route('/cookie')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		if(!req.cookies.key){
			res.send(false);
		}
		else{
			Player.findOne({ 'cookie.key': req.cookies.key},'-cookie', function (err, person) {
				if (err)
					res.send(false);
				//Return Player
				else{
					//console.log("Player gotten by cookie");
					res.json(person);
				}
			});
		}
    });
	
	router.route('/wg/tank/:tankid')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		Tank.findOne({ 'tankid': req.params.tankid },'picture name',function(err, tank){
			if(!tank || !tank['name']){

				wgapi.getTankInfo(req.params.tankid, function (err, tankinfo){
					res.json(tankinfo);
				});
			}
			else{

				res.json({'name':tank['name'], 'images': {'small_icon': tank['picture']}});
			}
		});
		
    });
	
	router.route('/rules')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		res.json({'sessionMin':(variables.sessionMin).toString(),'sessionsRequired':(variables.sessionsRequired).toString(),'tankIDs':variables.tankIDs});
    });
	
	router.route('/add/clan/:server/:clantag')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function(req, res) {
		DB.insertClan(req.params.clantag, req.params.server, function(err, result){
			res.json(result);
		});
	});
	
	// REGISTER OUR ROUTES -------------------------------
	// all of our routes will be prefixed with /api
	app.use('/api', router);
}