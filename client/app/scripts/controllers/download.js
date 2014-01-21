'use strict';

angular.module('downTheSpot')
.controller('DownloadCtrl', function($scope, musicData)
{
	$scope.tracksInfo = musicData.tracksInfo;
});