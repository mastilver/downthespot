'use strict';

angular.module('downTheSpot')
.factory('musicData', function($q, $timeout, $http)
{
	var services = 
	{
		spotify:
		{
			regex: /^http[s]?:\/\/open.spotify.com\/([a-z]+)\/([\S]+)$/,

			nbrRequestLimit: 10,
			nrbRequest: 0,


			type :
			{
				track:
				{
					requestUrl: 'http://ws.spotify.com/lookup/1/.json?uri=spotify:track:<<id>>',
					callBack: function(newTrackInfo)
					{
						var trackInfo =
						{
							name: newTrackInfo.track.name,
							artists: []
						}

						for(var artist in newTrackInfo.track.artists)
						{
							trackInfo.artists.push(newTrackInfo.track.artists[artist].name);
						}

						trackInfo.isrc = newTrackInfo.track['external-ids'].filter(function(x){ return x.type === 'isrc'})[0].id;

						console.log(newTrackInfo.track['external-ids']);

						console.log(trackInfo);


						factory.tracksInfo.push(trackInfo);
					}
				},

				album:
				{
					requestUrl: 'http://ws.spotify.com/lookup/1/.json?uri=spotify:album:<<id>>&extras=track',
					callBack: function(albumInfo)
					{

					}

				}
			}
		},

		deezer:
		{
			regex: /^http[s]?:\/\/www.deezer.com\/([a-z]+)\/([\S]+)$/,
			
			nbrRequestLimit: 50,
			nrbRequest: 0,

			type:
			{
				track:
				{
					requestUrl: 'http://api.deezer.com/2.0/track/<<id>>',
					callBack: function(newTrackInfo)
					{

					}
				},

				playlist:
				{
					requestUrl: 'http://api.deezer.com/playlist/<<id>>',
					callBack: function(playlistInfo)
					{

					}
				},

				artist:
				{
					requestUrl: 'http://api.deezer.com/artist/<<id>>/top',
					callBack: function(artistInfo)
					{

					}
				}
			}
		}
	};

	var checkForNewTracks = function()
	{
		for(var trackNum in factory.tracksInfo)
		{
			if(typeof factory.tracksInfo[trackNum].downloadLink === 'undefined' && typeof factory.tracksInfo[trackNum].quering === 'undefined')
			{
				factory.tracksInfo[trackNum].quering = true;

				$http.post('/getDownloadLink',
				{
					'name': factory.tracksInfo[trackNum].name,
					'artists': factory.tracksInfo[trackNum].artists
				})
				.then(function(response, status)
				{
					factory.tracksInfo[trackNum].downloadLink = response.data;
				});
			}
		}
	};

	
	



	var factory = {};

	factory.tracksInfo = [];
	factory.ratio = {
						fetched: 0,
						total: 0,
						percentage: function()
						{
							return (this.fetched / this.total) * 100;
						}
					};


	factory.clear = function()
	{
		factory.tracksInfo = [];
	}

	factory.fetchForm = function(formContent)
	{

		//allow CORS (cross-origin resource sharing)
		delete $http.defaults.headers.common['X-Requested-With'];




		var urls = formContent.split(/\s/);
		

		//one by one each service will look into the array of urls
		for(var service in services)
		{
			for(var url in urls)
			{
				if(services[service].regex.test(urls[url]))
				{
					services[service].regex.exec(urls[url]);

					var type = RegExp.$1;
					var id = RegExp.$2;

					if(typeof services[service].type[type] !== 'undefined')
					{
						//alert(typeof services[service].type[type]);

						var requestUrl = services[service].type[type].requestUrl.replace(/<<id>>/, id);
						var timeout = (services[service].nrbRequest / services[service].nbrRequestLimit) * 1000;
						var callBack = services[service].type[type].callBack;

						$http.get(requestUrl,
						{
							timeout: timeout
						})
						.then(function(result)
						{
							callBack(result.data);
							checkForNewTracks();
						});



					}
				}
			}
		}

















	};

	factory.addTrackInfo = function(url, artists, trackName)
	{
		var newTrackInfo = {
								url: url,
								artists: artists,
								trackName: trackName
							};

		factory.trackInfo.push(newTrackInfo);

	}









	return factory;
});