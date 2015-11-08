(function (){
    var app = angular.module('outreachApp',[])
    app.controller('upcomingController', function() {
    	var upcomingList = this;
    	upcomingList.workshops = [
    	  {date: '29/11/15', location: 'Hyderabad', coordinator: 'T.Rakesh Kumar'}];
    });
     var cities1 = [
              {
                  city : 'Gnanadeep college,kamareddy',
                 
              },
              {
                  city : 'New Delhi',
                 
              },
              {
                  city : 'Mumbai',
                 
              },
              {
                  city : 'kolkata',
                  
              },
              {
                  city : 'bihar',
                  
              },
	      {
                  city : 'kadapa',
                  
              }
          ];

  
   app.controller('mapCtrl', function ($scope) {
var geocoder = new google.maps.Geocoder();

var newcity = [{lan: "", lng: "", city: ""}];

var a = function (info,i){ 
 
   geocoder.geocode( { "address": info.city }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
        var location = results[0].geometry.location,
            lat      = location.lat(),
            lng      = location.lng();
            //newcity.push({lan: lat, lng: lng, city: info.city});
            $scope.createMarker(lat,lng,info.city,i);
    }
});

}

for(i=0;i<cities1.length;i++)
{
  a(cities1[i],i);

}

              var mapOptions = {
                  zoom: 4,
                  center: new google.maps.LatLng(20,80)                
              }
              $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
              
              
	      $scope.createMarker = function (lat,lng,city,i){
                  var marker = new google.maps.Marker({
                      map: $scope.map,
                      animation: google.maps.Animation.DROP,
                      draggable: true,
                      label : String(i+1),
                      position: new google.maps.LatLng(lat, lng),
                      //position: new google.maps.LatLng(17, 80),
                      title: city
                  });
                

             

              }  
    
	      
          });







})();
  
