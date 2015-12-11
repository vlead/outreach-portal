
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
         .when('/documents', {
	     templateUrl : '/static/partials/doc-upload.html',
	     controller  : 'doclist'
	 })
     
         .when('/profile', {
	     templateUrl : '/static/partials/profile.html',
	     controller  : 'profile'
	 })
     
	 .when('/addoc', {
	     templateUrl : '/static/partials/oc-add.html',
	     controller  : 'addoc'
         })
	 .when('/dashboard', {
	     templateUrl : '/static/partials/dashboard.html',
	     controller  : 'dashboard'
	 })
         .when('/adddoc', {
	     templateUrl : '/static/partials/doc-add.html',
	     controller  : 'adddoc'
	 })
         .when('/nc-dashboard', {
	     templateUrl : '/static/partials/nc-dashboard.html',
	     controller  : 'nc-dashboard'
	 })
         .when('/manage-workshops', {
	     templateUrl : '/static/partials/manage_workshops.html',
	     controller  : 'manage-workshops'
	 })
         .when('/contactoc', {
	     templateUrl : '/static/partials/contactoc.html',
	     controller  : 'contactoc'
	 })
         .when('/ncdocuments', {
	     templateUrl : '/static/partials/ncdocuments.html',
	     controller  : 'ncdocuments'
	 })
         .when('/nodalcenters', {
	     templateUrl : '/static/partials/nodalcenters.html',
	     controller  : 'nodalcenters'
	 })
         .when('/add-workshop', {
	     templateUrl : '/static/partials/add-workshop.html',
	     controller  : 'add-workshop'
         })
         .when('/manage-workshops/pending-action',{
             templateUrl: '/static/partials/pending-workshops.html',
             controller  : 'manage-workshops'
         })
         .when('/manage-workshops/workshop-history',{
             templateUrl: '/static/partials/workshop-history.html',
             controller  : 'manage-workshops'
         }).when('/editworkshop/:id', {
	     templateUrl : '/static/partials/edit-workshop.html',
	     controller  : 'editworkshop'
	 }).when('/upload_reports/:id', {
	     templateUrl : '/static/partials/upload-reports.html',
	     controller  : 'uploadreports'
	 });
     
     
     
     
	 
	    
		
	}
);


