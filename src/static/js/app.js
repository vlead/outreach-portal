angular.module('outreachApp',['ngRoute','outreachApp.controllers']).config(function($routeProvider) {
        $routeProvider

            // route for the home page
            .when('/manageoc', {
                templateUrl : '/static/partials/home.html',
                controller  : 'mainController'
            })
    

            // route for the about page
            .when('/deloc/:id', {
                templateUrl : '/static/partials/home.html',
                controller  : 'deloc'
            })
            .when('/editoc/:id', {
                templateUrl : '/static/partials/oc-edit.html',
                controller  : 'editoc'
            })
      
            // route for the contact page
            .when('/addoc', {
                templateUrl : '/static/partials/oc-add.html',
                controller  : 'addoc'
            });
    
    });


  
