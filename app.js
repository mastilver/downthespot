var express = require('express');

var app = express();
var server = require('http').createServer(app)
var io = require('socket.io').listen(server);

var getLink = require('./getLink.js');

app.use(express.static(__dirname + '/../client/app'))
.use(express.bodyParser());

app.post('/getDownloadLink', function(req, res)
{
	console.log(req.body);


	getLink(req.body)
	.on('finish', function(data)
	{
		res.end(data.downloadLink);
	});
});

app.listen(3000);


io.on('connect', function(socket)
{
	socket.on('getDownloadLink', function(data)
	{
		getLink(data).
		on('finish', function(data)
		{
			socket.emit('downloadLink', data.downloadLink)
		});
	});
});