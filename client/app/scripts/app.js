'use strict';

angular.module('downTheSpot', [])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'FormCtrl'
      })

      .when('/download', {
        templateUrl: 'views/download.html',
        controller: 'DownloadCtrl'
      })

      .otherwise({
        redirectTo: '/'
      });
  });