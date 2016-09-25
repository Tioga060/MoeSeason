// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var wgapi = require('../wgapi.js');
var variables = require('../variables.js');
var statsFuncs = require('../stats.js');
var async = require('async');
require('dotenv').config()

// create a schema
var playerSchema = new Schema({
  username: { type: String, required: true },
  playerid: { type: String, required: true, unique: true },
  server: 	{ type: String, required: true },
  starting_stats: {type: {}, default: false},
  latest_stats: {},
  cookie: {},
  session_data: {type: {}, default: false},
  sessions: Array,
  awards: [],
  created_at: {type: Date,default: new Date()},
  updated_at: Date
});

/*playerSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
	this.created_at = currentDate;
  console.log("Ready to save");
  next();
});*/

playerSchema.methods.setStartingStats = function() {
	
	var _this = this;
	var updateStarting = function(stats, cb){
		_this.starting_stats = stats;
		_this.latest_stats = stats;
		console.log("Got final stats");
		console.log(_this.latest_stats);
		_this.save(function(err) {
		  if (err) { 
				handleError(res, err);
			}
		  console.log('User saved successfully!');
		});

		cb(null,1);
	}
	wgapi.useTankStats(this.playerid, this.server, variables.tankIDs, [statsFuncs.initializeTankStats,updateStarting]);
}

playerSchema.methods.getSession = function(callback) {
	
	var _this = this;
	var updateSessions = function(stats, overall, cb){
		if(Object.keys(stats).length){_this.sessions.push(stats);}

		_this.latest_stats = overall;

		callback(null, _this);
	}
	wgapi.useTankStats(this.playerid, this.server, variables.tankIDs, [async.apply(statsFuncs.getSessionStats,_this.latest_stats),updateSessions]);
	
}

// the schema is useless so far
// we need to create a model using it
var Player = mongoose.model('Player', playerSchema);

// make this available to our users in our Node applications
module.exports = Player;