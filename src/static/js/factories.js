var service = angular.module('outreachApp.factories', []);
service.factory('dataFactory', function($http){
    var data = {};
    data.fetch = function(){
        return $http.get('/users');
    }
    data.fetchbyid = function(id){
        return $http.put('/users/2', id);
    }
    
    return data;
});
