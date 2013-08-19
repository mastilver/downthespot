function Download(tracksInfo, downloadLinks)
{
	this.tracksInfo = tracksInfo;
	this.downloadLinks = downloadLinks;
	this.Files = new Array();
	
		// DEV //
	//var_dump(this.tracksInfo);
	//var_dump(this.downloadLinks);
	
	
	
	var popUp = document.createElement('div');
	
	var downloadAllButton = document.createElement('input');
	downloadAllButton.type = 'submit';
	downloadAllButton.value = 'download all tracks';
	
	var objRef = this;
	downloadAllButton.addEventListener('click', function()
	{
		objRef.downloadAllTracks();
	});
	
	popUp.appendChild(downloadAllButton);
	
	
	for(var i = 0; i < this.tracksInfo.length; i++)
	{
		var trackDiv = document.createElement('div');
		
		var trackName = document.createElement('p');
		trackName.innerHTML = this.tracksInfo[i]['name'];
		
		var trackDownloadLink = document.createElement('a');
		trackDownloadLink.innerHTML = 'Download';
		trackDownloadLink.href = this.downloadLinks[i];
		trackDownloadLink.setAttribute('data-trackNumber', i);
		
		var objRef = this;
		trackDownloadLink.addEventListener('click', function(e)
		{
			objRef.downloadTrack(e.target.getAttribute('data-tracknumber'));
		
		
			e.preventDefault();
		});
		
		
		trackDiv.appendChild(trackName);
		trackDiv.appendChild(trackDownloadLink);
		
		popUp.appendChild(trackDiv);
	}
	
	document.body.appendChild(popUp);
}

/*
 * 
 * name: appendChild
 * @param
 * @return
 * 
 */
Download.prototype =
{
	downloadTrack : function(trackNumber)
	{
		console.log('download starting');
		
		
		
			//     LINK METHOD     //
			
		var link = document.createElement('a');
	    link.setAttribute('href', this.downloadLinks[trackNumber]);
	    link.setAttribute('download', this.tracksInfo[trackNumber].name);
	    link.click();
		
		
			//     IFRAME METHOD     //
		
		/*var iframe = document.createElement('iframe');
		iframe.setAttribute("src", this.downloadLinks[trackNumber]);
		//iframe.style.display = "none";
		document.body.appendChild(iframe);
		
		var_dump(iframe.contentWindow.document.body);
		
		
		
		iframe.load = function()
		{
			alert('test');
		};*/
		
		
			//     BLOB METHOD     //
		
		//var xhr = new XMLHttpRequest();
		//xhr.open('GET', this.downloadLinks[trackNumber]);
		//xhr.responseType = 'arraybuffer';
		
		////xhr.setRequestHeader('Content-Type', 'application/octet-stream');
		
		//var objRef = this;
		//xhr.onreadystatechange = function()
		//{
			//if (this.readyState == 4 && this.status == 200)
			//{
				
				//console.log('download finish');
				
				//var r = new FileReader();
				//r.onload = function(e)
				//{
					//alert("file loaded");
				//};
				
				//r.readAsText(this.response);
				
				
				///*var trackBlob = new Blob([this.response], {type: 'application/octet-stream'});
				
				//trackBlobUrl = URL.createObjectURL(trackBlob);
				//trackName = objRef.tracksInfo[trackNumber]['name'] + ' - ';
				
				
				//alert(trackName);
				
				//window.open(trackBlobUrl, trackName);*/
			//}
		//};
		
		//xhr.send(null);
		
		console.log('download started')
		
	},
	
	downloadAllTracks : function()
	{
		//alert(this.downloadLinks.length);
		
		for(var i = 0, c = this.downloadLinks.length; i < c; i++)
		{
			this.downloadTrack(i);
		}
	},
	
	downloadTriggeredTrack : function(e)
	{
		//alert(e.target.getAttribute('data-tracknumber'));
		
		this.downloadTrack(e.target.getAttribute('data-tracknumber'));
		
		
		e.preventDefault();
	}
}
