function FetchData()
{
	this.tracksInfo = [];//an array with artist's name and track's name calculating by the url given by the user
	
	this.currentLine = 0;//the current line on the textarea
	this.urls = document.getElementById('tracksInfo').value.split(/[\s]/);
}


FetchData.prototype =
{
	fetch : function()
	{
		//store how many request we did to each service during the current second
		deezerRequestCount = 0;
		spotifyRequestCount = 0;
		
		
		while(this.currentLine < this.urls.length)
		{
			if(/^http[s]?:\/\/open.spotify.com\/[a-z]+\/[\S]+$/.test(this.urls[this.currentLine]))
			{
				if(spotifyRequestCount < 10)
				{
					/^http[s]?:\/\/open.spotify.com\/([a-z]+)\/([\S]+)$/.exec(this.urls[this.currentLine]);
					this.spotify(RegExp.$1, RegExp.$2);
				}
				else break;
				
				spotifyRequestCount++;
			}
			else if(false)
			{
				if(deezerRequestCount < 50)
				{
					alert('deezer');
				}
				else break;
				
				deezerRequestCount++;
			}
			else
			{
				console.log('error, incorrect url: ' + this.urls[this.currentLine]);
			}
			
			this.currentLine++;
		}//end while()
		
		//if the process isn't finish (the maximum number of request have been reached). This function will be called later on.
		if(this.currentLine < this.urls.length)
		{
			var objInst = this;
			
			setTimeout(function()
			{
				objInst.fetch();
			}, 1000);
		}
		else
		{
			//TODO: check for multiple entry of the same track
			
			var xhr = new XMLHttpRequest();
			
			xhr.open('POST', 'app_dev.php/download');
			xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
			xhr.send('tracksInfo=' + encodeURIComponent(JSON.stringify(this.tracksInfo)));
			
			var objRef = this;
			
			xhr.onreadystatechange = function()
			{
				if (xhr.readyState == 4 && xhr.status == 200)
				{
					new Download(JSON.parse(decodeURIComponent(xhr.responseText))['tracksInfo'], JSON.parse(xhr.responseText)['downloadLinks']);
				}
			}
		}
	},
	
	////////////////////////////////////////////////////////////////////
	
	spotify : function(type, id)
	{
		this.spotifyRequestCount++;
		
		switch(type)
		{
			case 'track':
				this.spotifyTrack(id);
				break;
				
			case 'album':
				this.spotifyAlbum(id);
				break;
			
			default:
				console.log('error, incorect spotify type : ' + type);
		}
	},
	
	pushSpotifyTrack : function(track)
	{		
		var trackInfo =
		{
			name : track.name,
			artists : []
		}
		
		//get artists name
		for(var i = 0; i < track.artists.length; i++)
		{
			trackInfo.artists.push(track.artists[0].name);
		}
		
		
		this.tracksInfo.push(trackInfo);
	},
	
	
	spotifyTrack : function(id)
	{
		var xhr = new XMLHttpRequest();
		
		xhr.open('GET', 'http://ws.spotify.com/lookup/1/.json?uri=spotify:track:' + id, false);
		xhr.send(null);
		
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			var result = JSON.parse(xhr.responseText);
			this.pushSpotifyTrack(result.track);
		}
	},
	
	spotifyAlbum : function(id)
	{
		var xhr = new XMLHttpRequest();
		
		
		
		xhr.open('GET', 'http://ws.spotify.com/lookup/1/.json?uri=spotify:album:' + id + '&extras=track', false);
		xhr.send(null);
		
		if (xhr.readyState == 4 && xhr.status == 200)
		{
			var result = JSON.parse(xhr.responseText);
			
			//add one per one all tracks from the album
			for(var i = 0; i < result.album.tracks.length; i++)
			{
				this.pushSpotifyTrack(result.album.tracks[i]);
			}
		}
	},
	
	////////////////////////////////////////////////////////////////////
	
	deezer : function(url)
	{
		this.deezerRequestCount++;
	},
	
	deezerTrack : function(url)
	{
		
	},
	
	deezerPlaylist : function(url)
	{
		
	},
	
	deezerArtist : function(url)
	{
		
	}
}
