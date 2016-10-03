var gm = require('gm').subClass({imageMagick: true});;
var fs = require('fs')
var fse = require('fs-extra')
var font = './app/signatures/fonts/BebasNeue.otf';


function createSignature(player, cb){
	var txtColor = '#FFFFFF';
	if(player.color){txtColor = player.color;}
	gm('./app/signatures/images/background.png')
	.fill(txtColor)
	.font(font)
	.fontSize(32)

	.drawText(2, 96, player.username)
	.fontSize(24)
	.drawText(2,70,"Rank: "+player.overallrank.toString())
	.fill('#FFFFFF')
	.fontSize(22)
	.drawText(405, 53, player.stats.dpg.rank.toString())
	.drawText(405, 75, player.stats.spg.rank.toString())
	.drawText(405, 97, player.stats.kpg.rank.toString())
	.drawText(448, 53, player.stats.epg.rank.toString())
	.drawText(448, 75, player.stats.wr.rank.toString())
	.drawText(448, 97, player.rank.toString())
	.write('./public/sigs/signatures/'+player.playerid.toString()+'.png', function (err) {
		if (err) console.log(err);
		gm().command("composite") 
		.in("-geometry", "+378+2")
		.in(player.tankurl)
		.in('./public/sigs/signatures/'+player.playerid.toString()+'.png')
		.write('./public/sigs/signatures/'+player.playerid.toString()+'.png', function (err) {
			if (err) console.log(err);
			gm().command("composite") 
			.in("-geometry", "+0+0")
			.in('./public/sigs/signatures/'+player.playerid.toString()+'.png')
			.in('./public/sigs/backgrounds/'+player.playerid.toString()+'.png')
			.write('./public/sigs/signatures/'+player.playerid.toString()+'.png', function (err) {
				if (err) console.log(err);
				cb();
			})
		})
	});	
}

function fileExists(player, cb){
	fs.stat('./public/sigs/backgrounds/'+player.playerid.toString()+'.png', function(err, stat) {
		if(err == null) {
			if(cb){
				createSignature(player, cb);
			}
			else{
				createSignature(player, function(){});
			}
		} else if(err.code == 'ENOENT') {
			// file does not exist
			gm('./app/signatures/images/default.png')
			.write('./public/sigs/backgrounds/'+player.playerid.toString()+'.png', function (err) {
				if (err) console.log(err);
				if(cb){
					createSignature(player, cb);
				}
				else{
					createSignature(player, function(){});
				}
			});
		} else {
			console.log('Some other error: ', err.code);
		}
	});

}

exports.createSig = fileExists;