angular.module('outreachApp',[])
    .controller('upcomingController', function() {
    	var upcomingList = this;
    	upcomingList.workshops = [
    	  {date: '29/11/15', location: 'Hyderabad', coordinator: 'T.Rakesh Kumar'}];
    });
