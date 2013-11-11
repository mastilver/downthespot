var express = require('express');
var connect = require('connect');

var app = express();
app.use(connect.urlencoded());
app.use(connect.json());


//var server = require('http').createServer(app)
//var io = require('socket.io').listen(server);


var getLink = require('./getLink.js');

app.use(express.static(__dirname + '/client/app'));

app.post('/getDownloadLink', function(req, res)
{
	getLink(req.body)
	.on('finish', function(data)
	{
		res.end(data.downloadLink);
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