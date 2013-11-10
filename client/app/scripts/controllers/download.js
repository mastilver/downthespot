'use strict';

angular.module('downTheSpot')
.controller('DownloadCtrl', function($scope, musicData)
{
	//only for dev
	//$scope.tracksInfo =  [{"name":"Along Comes Mary","artists":["Bloodhound Gang", "bloodwhat??"]},{"name":"The House of the Rising Sun","artists":["The Animals"]},{"name":"Sweet Dreams (Are Made Of This)","artists":["Eurythmics"]},{"name":"U Can't Touch This","artists":["MC Hammer"]}];
	

	$scope.tracksInfo = musicData.tracksInfo;
});