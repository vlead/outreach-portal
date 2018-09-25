var service = angular.module('outreachApp.factories', []);
service.factory('dataFactory', function($http, $window){
  var headers = { 'email' : $window.email, 'key' : $window.key, 'token' : $window.token};
    var data = {};
    data.fetch = function(url){
      return $http.get(url, {headers: {"email" : "admin@vlabs.ac.in", "token":"dummytoken"}});
    };
    data.post = function(url, data){
      return $http.post(url, data, {headers : headers });
    };
    data.put = function(url, data){
      return $http.put(url, data, { headers : headers });
    };
    data.del = function(url){
      return $http.delete(url, { headers : headers });
    };
        
    return data;
});
