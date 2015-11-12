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
              },
              {
                  city : 'Mumbai',
                  desc : 'The Heart of India!'
              },
              {
                  city : 'kolkata',
                  desc : 'The Heart of India!'
              }
          ];
var geocoder = new google.maps.Geocoder();
var newcity = [{lan: "", lng: ""}];

var a = function (info){ 
 
   geocoder.geocode( { "address": info.city }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
        var location = results[0].geometry.location,
            lat      = location.lat(),
            lng      = location.lng();
            newcity.push({lan: lat, lng: lng});
        
    }
});

}
for(i=0;i<cities1.length;i++)
{
a(cities1[i]);

}
//alert("dfd");
  
   app.controller('mapCtrl', function ($scope) {

              var mapOptions = {
                  zoom: 4,
                  center: new google.maps.LatLng(20,80)                
              }

              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
	      var createMarker = function (info){
                  var marker = new google.maps.Marker({
                      map: $scope.map,
                      //position: new google.maps.LatLng(newcity[i].lan, newcity[i].lng),
                      position: new google.maps.LatLng(newcity[i].lan, newcity[i].lng),
                      title: info.city
                  });
              }  
              for (i = 0; i < newcity.length; i++){
		 		  		      		  
                  createMarker(newcity[i]);
              }
	      
          });
})();
  
