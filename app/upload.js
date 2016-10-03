var fileUpload = require('express-fileupload');
var Player = require('./models/player');
var gm = require('gm').subClass({imageMagick: true});;
var fs = require('fs')
var DB = require('./db.js')
var fse = require('fs-extra')

module.exports = function(app) {
	
	app.use(fileUpload());
	 
	app.post('/upload', function(req, res) {
		var file;
	 
		if (!req.files) {
			res.send('No files were uploaded.');
			return;
		}
	 
		
		
		file = req.files.file;
		var playerid = req.body.playerid;
		//validate cookie here
		var filetype = "";
		if(req.files.file.mimetype.includes("jpeg")){
			filetype = ".jpg";
		}
		else{
			filetype = ".png";
		}
		var moveloc = './'+playerid+filetype;
		
		if(!req.cookies.key){
			res.status(500).send("Error: no cookie");
		}
		else{
			Player.findOne({ 'cookie.key': req.cookies.key},'-cookie', function (err, person) {
				if (err)
					res.status(500).send("Error: no player found");
				//Return Player
				else{
					if(person.playerid.toString() == playerid.toString()){
						file.mv(moveloc, function(err) {
							if (err) {
								res.status(500).send(err);
							}
							else {
								var query = {'playerid' : playerid},
									update = { '$set':{'color':req.body.playercolor}},
									options = { upsert: true, new: true, setDefaultsOnInsert: true };

								// Find the document
								Player.findOneAndUpdate(query, update, options, function(error, p) {
									p.save(function(){
										gm(moveloc)
										.resize(468, 100, "!")
										.write('./public/sigs/backgrounds/'+playerid.toString()+'.png', function (err) {
											if (err) console.log(err);
											fs.unlink(moveloc);
											DB.updateSignature(playerid.toString(), function(){
												res.send('File uploaded!');
											});
											
										})
									});
								});
								
							}
						});
					}
					else{
						res.status(500).send("Wrong player attempting to change signature");
					}
				}
			});
		}
		
		
		
	});

};
