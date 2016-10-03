// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// create a schema
var commentSchema = new Schema({
  submitter: {type: String, required: true},
  target: {type: String, required: true},
  body: {type: String, required: true},
  created_at: {type: Date,default: new Date()},
  seenByTarget: {type: Boolean,default: false}
});


// the schema is useless so far
// we need to create a model using it
var Comment = mongoose.model('Comment', commentSchema);

// make this available to our users in our Node applications
module.exports = Comment;