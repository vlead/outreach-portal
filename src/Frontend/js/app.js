(function (){
    var app = angular.module('outreachApp',[])
    app.controller('upcomingController', function() {
    	var upcomingList = this;
    	upcomingList.workshops = [
    	  {date: '29/11/15', location: 'Hyderabad', coordinator: 'T.Rakesh Kumar'}];
    });
     var cities1 = [
              {
                  city : 'India',
                  desc : 'This is the best country in the world!'
              },
              {
                  city : 'New Delhi',
                  desc : 'The Heart of India!'
              }
          ];
   app.controller("geocodeCtrl", function($scope, $http) {  
   
   var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=%s&key=AIzaSyAEV1VldTH11hpV0ej-LLDc85GTHs68WjM';
   for(i=0;i<cities1.length;i++)
   {
    $http.get(url.replace('%s',cities1[i]['city'])).
    success(function(data, status, headers, config) {
    $scope.posts = data; 
   }).
  error(function(data, status, headers, config) {
  // log error
    });	 		  		      		  
   }              
              
  
  });

  var cities = [
              {
                  city : 'India',
                  desc : 'This is the best country in the world!',
                  lat : 23.200000,
                  long : 79.225487
              },
              {
                  city : 'New Delhi',
                  desc : 'The Heart of India!',
                  lat : 28.500000,
                  long : 77.250000
              },
              {
                  city : 'Mumbai',
                  desc : 'Bollywood city!',
                  lat : 19.000000,
                  long : 72.90000
              },
              {
                  city : 'hyderabad',
                  desc : 'Bollywood city!',
                  lat : 18.000000,
                  long : 20.90000
              },
              
              {
                  city : 'Kolkata',
                  desc : 'Howrah Bridge!',
                  lat : 22.500000,
                  long : 88.400000
              },
              {
                  city : 'Chennai  ',
                  desc : 'Kathipara Bridge!',
                  lat : 13.000000,
                  long : 80.250000
              }
          ];
   app.controller('mapCtrl', function ($scope) {

              var mapOptions = {
                  zoom: 4,
                  center: new google.maps.LatLng(20,80)                
              }

              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	      var createMarker = function (info){
                  var marker = new google.maps.Marker({
                      map: $scope.map,
                      position: new google.maps.LatLng(info.lat, info.long),
                      title: info.city
                  });
              }  
              for (i = 0; i < cities.length; i++){
		 		  		      		  
                  createMarker(cities[i]);
              }
	      
          });
})();
  
