var express = require('express');
var connect = require('connect');
var request = require('request');

var app = express();
app.use(connect.urlencoded());
app.use(connect.json());


//var server = require('http').createServer(app)
//var io = require('socket.io').listen(server);


var getLink = require('./getLink.js');

app.use(express.static(__dirname + '/client/app'));

app.post('/getDownloadLink', function(req, res)
{

	var trackInfo = {};

	console.log(req.body.isrc);

	request('http://musicbrainz.org/ws/2/recording?query=isrc:' + req.body.isrc + '&fmt=json', function(error, response, body)
	{
		if(error) throw error;

		var track = JSON.parse(body).recording[0];

		if(typeof track != 'undefined')
		{
			trackInfo['name'] = track.title;
			trackInfo['artists'] = [];

			for(var artistNum in track['artist-credit'])
			{
				trackInfo['artists'].push(track['artist-credit'][artistNum].artist.name)
			}
		}
		else
		{
			trackInfo['name'] = req.body.name;
			trackInfo['artists'] = req.body.artists;
		}
		

		console.log(trackInfo);


		getLink(trackInfo)
		.on('finish', function(data)
		{
			res.end(data.downloadLink);

			console.log('download link found: ' + data.downloadLink + ' for:');
			console.log(req.body);
			console.log('\n');
		})
		.on('failed', function(data)
		{
			console.log('download link not found for:');
			console.log(req.body);
			console.log('\n');
			res.end('');
		});
	});


	
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening at ' + port);


/*io.on('connect', function(socket)
{
	socket.on('getDownloadLink', function(data)
	{
		getLink(data).
		on('finish', function(data)
		{
			socket.emit('downloadLink', data.downloadLink)
		});
	});
});*/