var request = require('request');
var fs = require('fs');

var xmlParser = require('xml2js').parseString;

var errors =
{
	not_found: 'no tracks have been found',
	bad_isrc: 'no tracks have been found based on the given isrc'
}



/**
 * get music data from musicbrainz based on the isrc
 * isrc the isrc of the track
 * callback then the function is complete, it's called following this pattern: function(error, title, artists)
*/
var getMusicBrainzData = function(isrc, callback)
{
	request('http://musicbrainz.org/ws/2/recording?query=isrc:' + isrc + '&fmt=json', function(error, response, body)
	{
		if(error) return callback(error);


		var track = JSON.parse(body).recording[0];

		if(typeof track === 'undefined') return callback(errors.bad_isrc);


		var artists = [];

		for(var artistNum in track['artist-credit'])
		{
			artists.push(track['artist-credit'][artistNum].artist.name);
		}

		callback(null, track.title, artists);
	});
};


var getPleerLink = function(title, artists, callback)
{
	var url = ('http://pleer.com/search?q=' + title + '+' + artists.join('+') + '&target=tracks&page=1&quality=best').replace(/\s/g, '+');

	request(url, function(err, response, body)
	{
		if(err) return callback(err);


		// TODO: this code is to complicate, pleer only have to change a bit their code to ruins everything

		xmlParser(body, {strict: false, normalizeTags: true}, function(err, result)
		{
			if(err) return callback(err);

			var link = 'http://pleer.com/site_api/files/get_url?action=download&id=';

			try
			{
				link += result.html.body[0].div[1].div[2].div[1].div[0].div[2].div[0].div[0].div[1].ol[0].li[0].$.LINK;

			}
			catch(e)
			{
				return callback(errors.not_found);
			}

			request(link, function(err, response, body)
			{
				if(err) return callback(err);

				callback(null, JSON.parse(body).track_link);
			});
		});
	});
};


module.exports = function(isrc, title, artists, callback)
{
	// TODO: add a boolean as paramters to enable/disable musicbrainz check
	// TODO: handle incorect parameters


	getMusicBrainzData(isrc, function(err, mbTitle, mbArtists)
	{
		// if the function worked, we change the default parameters
		if(!err)
		{
			title = mbTitle;
			artists = mbArtists;
		}

		getPleerLink(title, artists, callback);
	});
};