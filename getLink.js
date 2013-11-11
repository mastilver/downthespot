var EventEmitter = require('events').EventEmitter;
var request = require('request');

var musicLinkProviderInfos =
[
	{
		generateUrl: function(trackInfo)
		{
			var searchString = '';

			

			for(var numArtirst in trackInfo.artists)
			{
				searchString += trackInfo.artists[numArtirst].split(' ').join('-') + '-';
			}

			searchString += trackInfo.name.split(' ').join('-');

			return 'http://www.mp3olimp.net/' + searchString;
		},

		//as all space will be removed, please do not leave any space into your regex
		regex:
		{
			content: /<div id="whole">\s*<div id="sort">[.\s\S]+?<div class="pagination">\s*([.\s\S]+?)<a id="moretrend"/,

			block: 	/<div class="mp3Play">\s*<div class="wrap">\s*([.\s\S]+?<div class="clear">[.\s\S]+?)<div class="clear">[.\s\S]+?<div class="clear">/g, //DO NOT FORGET THE g FLAG
			


			downloadLink: /<span class="mp3Title" href="javascript:" title="(http:\/\/.*mp3)">/,
			duration: /<div class="fileinfo">[.\s\S]+?<br \/>(\d{2}):(\d{2})<br \/>[.\s\S]+?<\/div>/,
			quality: /<div class="fileinfo">\s*(\d+) kbps.+<\/div>/,
		}
	}
]


function servicesQueries(trackInfo, numProvider)
{
	var link = new EventEmitter();



	var musicLinkProvider = musicLinkProviderInfos[numProvider];


	var url = musicLinkProvider.generateUrl(trackInfo);

	request(url, function(error, response, body)
	{
		if(error) throw error;

		if(response.statusCode != 200)
		{
			link.emit('failed');
			return ;
		}

		content = musicLinkProvider.regex.content.exec(body);

		if(content === null)
		{
			link.emit('failed');
			return ;
		}

		content = content[1];


		var rawData = [];
		var match;
		var i = 0;

		while((match =  musicLinkProvider.regex.block.exec(content)) !== null)
		{

			rawData[i] = {};


			var durationMatch = musicLinkProvider.regex.duration.exec(match[1]);

			if(durationMatch !== null)
			{
				rawData[i]['minute'] = parseInt(durationMatch[1]);
				rawData[i]['second'] = parseInt(durationMatch[2]);
			}
			else
			{
				rawData[i]['minute'] = 0;
				rawData[i]['second'] = 0;
			}

			rawData[i]['duration'] = rawData[i]['minute'] * 60 + rawData[i]['second'];

			var qualityMatch =  musicLinkProvider.regex.quality.exec(match[1]);

			rawData[i]['quality'] = (qualityMatch !== null)? parseInt(qualityMatch[1]) : 0;


			var downloadLinkMatch = musicLinkProvider.regex.downloadLink.exec(match[1]);

			rawData[i]['downloadLink'] = (downloadLinkMatch !== null)? downloadLinkMatch[1] : '';


			i++;
		}

		if(rawData.length > 0)
		{
			link.emit('finish', rawData);
		}
		else
		{
			link.emit('failed');
		}
	});

	return link;
}



module.exports = function(trackInfo)
{
	var event = new EventEmitter();



	//initialisation of serviceWaiter
	/*var serviceNumber = 0;
	var serviceMaxNumber = musicLinkProviderInfos.length;
	var serviceWaiter = servicesQueries(trackInfo, serviceNumber);
	
	var fail = function()
	{

	};

	var succes = function()
	{
		
	};


	serviceWaiter.on('failed', function()
	{
		//we check with the next service
		serviceWaiter = servicesQueries(trackInfo, ++serviceNumber);
	})
	.on('finish', function()
	{
		
	});
	*/

	servicesQueries(trackInfo, 0)
	.on('finish', function(data)
	{
		var filteredData = data.filter(function(x) {return x.duration > trackInfo.duration -10 && x.duration < trackInfo.duration + 10 });

		if(filteredData.length == 0)
		{
			filteredData = data;
		}

		filteredData.sort(function(a, b)
		{
			if(a.quality > b.quality)
				return -1;
			
			if(a.quality < b.quality)
				return 1;
			
			return 0;
		});

		if(filteredData.length > 0)
		{
			event.emit('finish', filteredData[0]);
		}
		else
		{
			event.emit('failed');
		}
	})
	.on('failed', function()
	{
		event.emit('failed');
	});


	return event;
}






