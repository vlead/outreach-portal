var app = angular.module('outreachApp',['ngRoute','outreachApp.controllers','outreachApp.factories']);
app.config(function($routeProvider){
    $routeProvider
	.when('/manage-oc', {
	    templateUrl : '/static/partials/manage-ocs.html',
	    controller  : 'AdminController'
	})
        .when('/workshop-list', {
	    templateUrl : '/static/partials/workshop-list.html',
	    controller  : 'AdminController'
	})
        .when('/nc-users-list', {
	    templateUrl : '/static/partials/nc-users-list.html',
	    controller  : 'AdminController'
	})
        .when('/oc-users-list', {
	    templateUrl : '/static/partials/oc-users-list.html',
	    controller  : 'AdminController'
	})
        .when('/edit-oc/:id', {
	    templateUrl : '/static/partials/edit-oc.html',
	    controller  : 'AdminController'
	})
        .when('/documents', {
	    templateUrl : '/static/partials/upload-doc.html',
	    controller  : 'AdminController'
	})
        .when('/profile', {
	    templateUrl : '/static/partials/profile.html',
	    controller  : 'AdminController'
	})
    	.when('/add-oc', {
	    templateUrl : '/static/partials/add-oc.html',
	    controller  : 'AdminController'
        })
	.when('/admin-dashboard', {
	    templateUrl : '/static/partials/admin-dashboard.html',
	    controller  : 'AdminController'
	})
        .when('/add-doc', {
	    templateUrl : '/static/partials/add-doc.html',
	    controller  : 'AdminController'
	})
        .when('/nc-dashboard', {
	    templateUrl : '/static/partials/nc-dashboard.html',
	    controller  : 'nc-dashboard'
	})
        .when('/edit-nc/:id', {
	    templateUrl : '/static/partials/edit-nc.html',
	    controller  : 'edit-nc'
	})
        .when('/manage-workshops', {
	    templateUrl : '/static/partials/manage-workshops.html',
	    controller  : 'manage-workshops'
	})
        .when('/contact-oc', {
	    templateUrl : '/static/partials/contact-oc.html',
	    controller  : 'contact-oc'
	})
        .when('/nc-documents', {
	    templateUrl : '/static/partials/nc-documents.html',
	    controller  : 'nc-documents'
	})
        .when('/nodal-centers', {
	    templateUrl : '/static/partials/nodal-centres.html',
	    controller  : 'nodal-centers'
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
        })
        .when('/edit-workshop/:id', {
	    templateUrl : '/static/partials/edit-workshop.html',
	    controller  : 'edit-workshop'
	})
        .when('/upload-reports/:id', {
	    templateUrl : '/static/partials/upload-reports.html',
	    controller  : 'upload-reports'
	})
        .when('/oc-upload-reports/:id', {
	    templateUrl : '/static/partials/oc-upload-reports.html',
	    controller  : 'upload-reports'
	})
        .when('/oc-dashboard', {
	    templateUrl : '/static/partials/oc-dashboard.html',
	    controller  : 'oc-dashboard'
	})
        .when('/manage-nc', {
	    templateUrl : '/static/partials/manage-ncs.html',
	    controller  : 'manage-nc'
	})
        .when('/add-nc', {
	    templateUrl : '/static/partials/add-nc.html',
	    controller  : 'add-nc'
	})
        .when('/manage-centres', {
	    templateUrl : '/static/partials/manage-centres.html',
	    controller  : 'manage-centres'
	})
        .when('/add-centre', {
	    templateUrl : '/static/partials/add-centre.html',
	    controller  : 'add-centre'
	})
        .when('/edit-centre/:id', {
	    templateUrl : '/static/partials/edit-centre.html',
	    controller  : 'edit-centre'
	})
        .when('/oc-manage-workshops', {
	    templateUrl : '/static/partials/oc-manage-workshops.html',
	    controller  : 'oc-manage-workshops'
	})
        .when('/oc-documents', {
	    templateUrl : '/static/partials/oc-docs.html',
	    controller  : 'oc-doclist'
	})
        .when('/oc-manage-workshops/nc-workshops', {
	    templateUrl : '/static/partials/nc-workshops.html',
	    controller  : 'nc-workshops'
	})
        .when('/review-reports/:id', {
	    templateUrl : '/static/partials/review-reports.html',
	    controller  : 'review-reports'
	})
        .when('/view-reports/:id', {
	    templateUrl : '/static/partials/view-reports.html',
	    controller  : 'review-reports'
	})
        .when('/oc-manage-workshops/oc-workshop-history', {
	    templateUrl : '/static/partials/oc-workshop-history.html',
	    controller  : 'oc-workshop-history'
	});
    
}
);

app.factory('workshops', function($http){
        return {
            list: function(callback){
                $http.get('/workshops').success(callback);
                
          }
        };
      });

app.factory('users', function($http){
        return {
            list: function(callback){
                $http.get('/users').success(callback);
                
          }
        };
      });
