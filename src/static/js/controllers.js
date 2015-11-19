/**
 * Created by Sandeep on 01/06/14.
 */
angular.module('outreachApp.controllers',[]).controller('mapCtrl', function ($scope) {
	var cities = [
        {
            city : 'Gnanadeep college,kamareddy',
	    date: '2/12/2015',
	    coordinator: 'A',
            
        },
        {
            city : 'New Delhi',
	    date: '13/11/2015',
	    coordinator: 'A2',
            
            
        },
        {
            city : 'Mumbai',
	    date: '4/12/2015',
	    coordinator: 'A1',
            
            
        },
        {
            city : 'kolkata',
	    date: '5/12/2015',
	    coordinator: 'B',
            
            
        },
        {
            city : 'bihar',
	    date: '29/08/2015',
	    coordinator: 'C',
            
            
        },
	{
            city : 'kadapa',
            date: '29/11/2015',
	    coordinator: 'D',
            
        },
        {
            city: 'Rajahmundry',
	    date: '29/11/2015',
	    coordinator: 'E',
            
        }
    ];
        
	$scope.upcoming = [];
	var geocoder = new google.maps.Geocoder();
	var get_geocode = function (cities,count){
	    $scope.upcoming.push({city: cities.city, date: cities.date, coordinator: cities.coordinator});
	    geocoder.geocode( { "address": cities.city }, 
			      function(results, status) {
				  if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
				      var location = results[0].geometry.location,
				      lat      = location.lat(),
				      lng      = location.lng();
				      //newcity.push({lan: lat, lng: lng, city: info.city});
				      //$scope.upcoming.push({city: cities.city, date: cities.date, coordinator: cities.coordinator});
				      $scope.createMarker(lat,lng,cities,count);
				  }
			      });
	      
	}
	
        today = new Date();
        var count = 0;
	for(i=0;i<cities.length;i++)
	{
            //var yest = String(cities[i].date);
	    date_array = cities[i].date.split("/");
	   
	    workshop_date = new Date(Number(date_array[2]), Number(date_array[1])-1, Number(date_array[0]));
	    console.log(today.getDate(),typeof(today.getMonth()));
	    if((today <= workshop_date) || (today.getDate() == workshop_date.getDate() & (today.getMonth() == workshop_date.getMonth()) & (today.getFullYear() == workshop_date.getFullYear()))){
		count ++;
		get_geocode(cities[i],count);
	    }
	    
	}
	
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(20,80)                
        }
	
	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        $scope.createMarker = function (lat,lng,cities,count){
	    var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                draggable: true,
                label : String(count),
                position: new google.maps.LatLng(lat, lng),
                //position: new google.maps.LatLng(17, 80),
                title: cities.city
            });
        }  
	
    });

