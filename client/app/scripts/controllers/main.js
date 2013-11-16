'use strict';

angular.module('downTheSpot')
.controller('FormCtrl', function($scope, $location, musicData)
{
	musicData.clear();

	$scope.submit = function()
	{
		if($scope.formContent !== undefined)
		{
			musicData.fetchForm($scope.formContent);
			$location.path('/download');
		}
	};

	$scope.musicData = musicData.tracksInfo;

	//dev
	//$scope.formContent = 'http://open.spotify.com/track/7CPva6B83iFyH4PVQWW14T http://open.spotify.com/track/3XC7Jd6SfrQYKZJ6inyRHK http://open.spotify.com/track/2CVqF1sLhwut4NiZxzNUnC http://open.spotify.com/track/1B75hgRqe7A4fwee3g3Wmu';
});
