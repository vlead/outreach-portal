angular.module('outreachApp',['ngRoute','outreachApp.controllers']).config
(function($routeProvider)
	{
		$routeProvider
			.when('/manageoc', {
				templateUrl : '/static/partials/home.html',
				controller  : 'mainController'
				})
	
			.when('/deloc/:id', {
				templateUrl : '/static/partials/home.html',
				controller  : 'deloc'
				})
				
			.when('/editoc/:id', {
				templateUrl : '/static/partials/oc-edit.html',
				controller  : 'editoc'
				})

			.when('/addoc', {
				templateUrl : '/static/partials/oc-add.html',
				controller  : 'addoc'
				});
		
	}
);


  
