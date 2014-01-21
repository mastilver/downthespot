var express = require('express');
var connect = require('connect');
var request = require('request');

var app = express();

var getLink = require('./lib/getLink.js');


app.use(connect.urlencoded());
app.use(connect.json());
app.use(express.static(__dirname + '/client/app'));


app.post('/getDownloadLink', function(req, res)
{
	console.log(req.body.isrc, req.body.name, req.body.artists);

	getLink(req.body.isrc, req.body.name, req.body.artists, function(err, link)
	{
		if(err)
		{
			res.end('');
			console.error(req.body.isrc, req.body.name, req.body.artists, err);
		}
		else
		{
			res.end(link)
		}
	});
});


var port = process.env.PORT || 3000;
app.listen(port);
console.log('server listening at ' + port);