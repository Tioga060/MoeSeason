// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var tankSchema = new Schema({
  tankid: { type: String, required: true, unique: true },
  ranks: {},
  sessions: {},
  name: {type: String, default: false},
  picture: {type: String, default: false},
  moerank: [],
  created_at: {type: Date,default: new Date()},
  updated_at: Date
});

tankSchema.pre('save', function(next) {
  // get the current date
  var currentDate = new Date();
  
  // change the updated_at field to current date
  this.updated_at = currentDate;

  // if created_at doesn't exist, add to that field
  if (!this.created_at)
	this.created_at = currentDate;
  //console.log("Ready to save");
  next();
});

// the schema is useless so far
// we need to create a model using it
var Tank = mongoose.model('Tank', tankSchema);

// make this available to our users in our Node applications
module.exports = Tank;