(function (){
    var app = angular.module('outreachApp',[])
    app.controller('upcomingController', function() {
    	var upcomingList = this;
    	upcomingList.workshops = [
    	    {date: '29/11/15', location: 'Hyderabad', coordinator: 'T.Rakesh Kumar'},
    	    {date: '29/11/15', location: 'Hyderabad', coordinator: 'T.Rakesh Kumar'}
    	];
    });
    var cities = [
        {
            city : 'Gnanadeep college,kamareddy',
	    date: '29/10/2015',
            
        },
        {
            city : 'New Delhi',
	    date: '29/11/2015',
            
        },
        {
            city : 'Mumbai',
	    date: '29/09/2015',
            
        },
        {
            city : 'kolkata',
	    date: '29/11/2015',
            
        },
        {
            city : 'bihar',
	    date: '29/08/2015',
            
        },
	{
            city : 'kadapa',
            date: '29/11/2015',
        },
        {
            city: 'Rajahmundry',
	    date: '29/11/2015',
        }
    ];
        
    app.controller('mapCtrl', function ($scope) {
	var geocoder = new google.maps.Geocoder();
	var get_geocode = function (cities,count){ 
	    geocoder.geocode( { "address": cities.city }, 
			      function(results, status) {
				  if (status == google.maps.GeocoderStatus.OK && results.length > 0) {
				      var location = results[0].geometry.location,
				      lat      = location.lat(),
				      lng      = location.lng();
				      //newcity.push({lan: lat, lng: lng, city: info.city});
				      $scope.createMarker(lat,lng,cities.city,count);
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
	    if(today <= workshop_date){
		count ++;
		get_geocode(cities[i],count);
	    }
	    
	}
	
        var mapOptions = {
            zoom: 4,
            center: new google.maps.LatLng(20,80)                
        }
        $scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        $scope.createMarker = function (lat,lng,city,count){
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                draggable: true,
                label : String(count),
                position: new google.maps.LatLng(lat, lng),
                //position: new google.maps.LatLng(17, 80),
                title: city
            });
        }  
	
    });
    
})();
  
