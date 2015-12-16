
angular.module('outreachApp.controllers',[])
.controller('mapCtrl', function ($scope)
{
	var cities = 
    [
        {
            city : 'Gnanadeep college,kamareddy',
	    date: '2/12/2016',
	    coordinator: 'A',
            
        },
        {
            city : 'New Delhi',
	    date: '13/11/2016',
	    coordinator: 'A2',
            
            
        },
        {
            city : 'Mumbai',
	    date: '4/12/2016',
	    coordinator: 'A1',
            
            
        },
        {
            city : 'kolkata',
	    date: '5/12/2016',
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
	var get_geocode = function (cities,count)
        {
	       $scope.upcoming.push({city: cities.city, date: cities.date, coordinator: cities.coordinator});
	       geocoder.geocode({ "address": cities.city }, function(results, status) 
                    {
				        if (status == google.maps.GeocoderStatus.OK && results.length > 0)
                        {
				            var location = results[0].geometry.location,
				            lat      = location.lat(),
				            lng      = location.lng();
				            $scope.createMarker(lat,lng,cities,count);
        				}
			         }
                    );
	    }
	
    today = new Date();
    var count = 0;
	for(i=0;i<cities.length;i++)
	{
        date_array = cities[i].date.split("/");
	    workshop_date = new Date(Number(date_array[2]), Number(date_array[1])-1, Number(date_array[0]));
	    if((today <= workshop_date) || (today.getDate() == workshop_date.getDate() & (today.getMonth() == workshop_date.getMonth()) 
            & (today.getFullYear() == workshop_date.getFullYear())))
        {
		      count ++;
		      get_geocode(cities[i],count);
	    }
	    
	}
	
    var mapOptions = { zoom: 4, center: new google.maps.LatLng(20,80) }
	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
    $scope.createMarker = function (lat,lng,cities,count)
    {
	   var marker = new google.maps.Marker(
            {
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                draggable: true,
                label : String(count),
                position: new google.maps.LatLng(lat, lng),
                title: cities.city
            });
    }  
	
}).controller("mainController", function($scope, $http, $routeParams) {
    $http.get('/users?role_id=2').success(function(data, status, headers, config)
    {
        $scope.message= data;
        
      
    }).error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $scope.del =  function(a)
    {
        if(confirm("Are you sure!") == true)
        {
            $http.delete('/users/'+a).
                success(function(data, status, headers, config) 
                        {
                            
                           window.location.href = "#/manageoc";
                            
                        }).
                error(function(data, status, headers, config)
                      {
                          console.log(data);
                      
                      });
            
        }
        else
            return;
         
    }
    
}).controller("deloc", function($scope, $http, $routeParams) {
  
        $http.delete('/users/'+$routeParams.id).
            success(function(data, status, headers, config) 
                    {
                      
                           window.location.href = "#/manageoc";
                      
                    }).
            error(function(data, status, headers, config)
                  {
                      console.log(data);
                      
                  });

        
  


}).controller("editoc", function($scope, $http, $routeParams) {
  $http.get('/users?id='+$routeParams.id).
    success(function(data, status, headers, config) 
    {
        $scope.message= data;
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });

    $scope.submit = function () 
    {
        if($scope.message[0].name != "" & $scope.message[0].email != "")
        {
            $http.put('/users/'+$routeParams.id, {'name' : $scope.message[0].name, 'email' : $scope.message[0].email}).success(function(data, status, headers, config)
                {
                    $scope.status = "Success";
                    window.location.href = "#/manageoc";
                                      
                }).
                error(function(data, status, headers, config)
                {
                    if(status == 500)
                    {
                        
                        $scope.status = "Duplicate Email";
                    }
                    else if(status == 400)
                    {
                        $scope.status = "Invalid username"
                    }
                    else
                    {
                        $scope.status = "Failed"
                    }
                    
                });
        }
        else
        {
            $scope.status = "Not empty"
        }
        
    }


}).controller("addoc", function($scope, $http, $routeParams) {

    $scope.submit = function(isvalid)
    {
        if(isvalid)
        {
            $http.post('/users',{'name' : $scope.name,'email' : $scope.email,'role' : { 'id' : 2 } } ).
            success(function(data, status, headers, config)
            {
                $scope.status = "Success";
                window.location.href = "#/manageoc";
                //$scope.message= $routeParams.id;
                
            }).
            error(function(data, status, headers, config)
            {
                if(status == 500)
                {
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400)
                {
                    $scope.status = "Invalid username"
                }
                else
                {
                    $scope.status = "Failed"
                }
            });
  
        }
        else
        {
            $scope.status = "Fill Details"
        }
    }
}).controller("doclist", function($scope, $http, $routeParams, $route) {
    
    $http.get('/reference_documents').
    success(function(data, status, headers, config) 
    {
        $scope.documents= data;
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $scope.deldoc =  function(id)
    {
        $http.delete('/reference_documents/'+id).
            success(function(data, status, headers, config) 
                    {
                        $scope.status= "Deleted";
                        $route.reload();
              
                    }).
            error(function(data, status, headers, config)
                  {
                      console.log(data);
                      
                  });
        
        
        
    }


}).controller("adddoc", function($scope, $http, $routeParams, $route) {
    
    

}).controller("dashboard", function($scope, $http, $routeParams, $route) {
    
    

}).controller("profile", function($scope, $http, $routeParams, $route) {
    
    $http.get('/users?role_id=1').
    success(function(data, status, headers, config) 
    {
        $scope.users = data;
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    

}).controller("nc-dashboard", function($scope, $http, $routeParams, $route, $window) {
   // alert($window.number);
    $http.get('/workshops?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {
                var count = 0;
                var participants = 0;
                var experiments = 0;
                for(i=0;i<data.length;i++)
                {
                    count = count +1;
                    participants = data[i].participants_attended + participants;
                    experiments = data[i].experiments_conducted + experiments;
                    
                    //    alert(typeof(data[i].participants_attended));
                   
                }
                $scope.participants = participants;
                $scope.experiments = experiments;
                $scope.count = count;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $http.get('/nodal_coordinator_details?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {

                var target_workshops = 0;
                var target_experiments = 0;
                var target_participants = 0;
                
                for(i=0;i<data.length;i++)
                {

                    target_workshops = data[i].target_workshops + target_workshops;
                    target_experiments = data[i].target_experiments + target_experiments;
                    target_participants = data[i].target_participants + target_participants;
                    
                   
                }
                $scope.target_workshops = target_workshops;
                $scope.target_experiments = target_experiments;
                $scope.target_participants = target_participants;
                
                
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    
    

}).controller("manage-workshops", function($scope, $http, $routeParams, $route, $window) {
   
    $http.get('/workshops?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {

                today = new Date();
                var upcoming = 0;
                var ups = [];
                var history = [];
                var pending = [];
	        for(i=0;i<data.length;i++)
	        {
                    
                    workshop_date = new Date(data[i].date);
                    var workshop_id = data[i].id ;
                    if ((today > workshop_date) & (data[i].status == "Upcoming")){
                        $http.put('/workshops/'+workshop_id.toString(), {'status': 'Pending for approval'}).success(function(data, status){ console.log('Status success'); });
                    }
                    if( (today <= workshop_date) ||(today.getDate() == workshop_date.getDate() & (today.getMonth() == workshop_date.getMonth()) 
                                                    & (today.getFullYear() == workshop_date.getFullYear())))
                    {
                        ups.push(data[i]);
		        upcoming = upcoming + 1;
	            }
	        
                    else if(data[i].status == "Approved")
                    {
                        history.push(data[i]);
                    }
                    else if(data[i].status == "Pending for approval")
                    {
                        pending.push(data[i]);
                    }
                }
                $scope.history = history;
                $scope.pending = pending;
                $scope.ups = ups;
                $scope.upcoming = upcoming;
          //    $scope.experiments = experiments;
          //    $scope.count = count;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $scope.cancel = function(id)
    {
        if(confirm("Are you sure!") == true)
        {
            $http.delete('/workshops/'+id).
                success(function(data, status, headers, config) 
                        {
                            $route.reload();
                            
                            
                        }).
                error(function(data, status, headers, config)
                      {
                          console.log(data);
                          
                      });
            
        }
    }
  
}).controller("contactoc", function($scope, $http, $routeParams, $route, $window) {
   
    $http.get('/nodal_coordinator_details?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {
                $scope.oc = data;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
  
}).controller("ncdocuments", function($scope, $http, $routeParams, $route, $window) {
   
    $http.get('/reference_documents').
    success(function(data, status, headers, config) 
            {
                $scope.docs = data;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
  
}).controller("nodalcenters", function($scope, $http, $routeParams, $route, $window) {
   
    $http.get('/nodal_centres').
    success(function(data, status, headers, config) 
            {

                $scope.centers = data;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
  
}).controller("add-workshop", function($scope, $location, $http, $routeParams, $route, $window) {
    $scope.submit = function(isvalid)
    {
        if(isvalid)
        {
            $http.post('/workshops',
                       { "name" : $scope.name, "location" : $scope.location,  "user" : {"id" : $window.number }, "participating_institutes" : $scope.insts,
                         "no_of_participants_expected" : $scope.parti, "no_of_sessions" : Number($scope.sessions),  "labs_planned" : Number($scope.labs),
                         "status" : "Upcoming",  "date" : $scope.date }).
            success(function(data, status, headers, config)
            {
                $scope.status = "Success";
                $location.path("/manage-workshops")

                
            }).
            error(function(data, status, headers, config)
                  {alert(status);
                if(status == 500)
                {
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400)
                {
                    $scope.status = "Invalid username"
                }
                else
                {
                    $scope.status = "Failed"
                }
            });
  
        }
        else
        {
            $scope.status = "Fill Details"
        }
    }
  
}).controller("editworkshop", function($scope, $http, $routeParams, $route, $window) {
  $http.get('/workshops/'+$routeParams.id).
    success(function(data, status, headers, config) 
    {
        $scope.message= data;
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });

    $scope.submit = function(isvalid) 
    {
        if(isvalid)
        {
            $http.put('/workshops/'+$routeParams.id, { "name" : $scope.message.name, "location" : $scope.message.location,  "user" : {"id" : $window.number }, "participating_institutes" : $scope.message.participating_institutes,"no_of_participants_expected" : $scope.message.no_of_participants_expected, "no_of_sessions" : Number($scope.message.no_of_sessions),  "labs_planned" : Number($scope.message.labs_planned),
                         "status" : "Upcoming",  "date" : $scope.message.date}).success(function(data, status, headers, config)
                {
                    $scope.status = "Success";
                    window.location.href = "#/manage-workshops";
                                      
                }).
                error(function(data, status, headers, config)
                {
                    if(status == 500)
                    {
                        
                        $scope.status = "Duplicate Email";
                    }
                    else if(status == 400)
                    {
                        $scope.status = "Invalid username"
                    }
                    else
                    {
                        $scope.status = "Failed"
                    }
                    
                });
        }
        else
        {
            $scope.status = "Not empty"
        }
        
    }


}).controller("autoCompl",function($scope, MovieRetriever){
    $scope.movies = ["Lord of the Rings",
                     "Drive",
                     "Science of Sleep",
                     "Back to the Future",
                     "Oldboy"];

    // gives another movie array on change
    $scope.updateMovies = function(typed){
        // MovieRetriever could be some service returning a promise
        $scope.newmovies = MovieRetriever.getmovies(typed);
        $scope.newmovies.then(function(data){
              $scope.movies = data;
        });
    }
}).controller("oc-dashboard", function($scope, $http, $routeParams, $route, $window) {
   // alert($window.number);
    $http.get('/workshops?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {
                var count = 0;
                var participants = 0;
                var experiments = 0;
                for(i=0;i<data.length;i++)
                {
                    count = count +1;
                    participants = data[i].participants_attended + participants;
                    experiments = data[i].experiments_conducted + experiments;
                    
                    //    alert(typeof(data[i].participants_attended));
                   
                }
                $scope.participants = participants;
                $scope.experiments = experiments;
                $scope.count = count;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $http.get('/nodal_coordinator_details?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {

                var target_workshops = 0;
                var target_experiments = 0;
                var target_participants = 0;
                
                for(i=0;i<data.length;i++)
                {

                    target_workshops = data[i].target_workshops + target_workshops;
                    target_experiments = data[i].target_experiments + target_experiments;
                    target_participants = data[i].target_participants + target_participants;
                    
                   
                }
                $scope.target_workshops = target_workshops;
                $scope.target_experiments = target_experiments;
                $scope.target_participants = target_participants;
                
                
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    
    

}).controller("manage-nc", function($scope, $http, $routeParams, $window, $route) {
    $http.get('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config)
    {
        var coordinators = [];                                                                             
        for( i=0;i<data.length;i++)
        {
            
            $http.get('/users/'+ data[i].id).success(function(data, status, headers, config)
                                            {  
                                                coordinators.push(data);
                                                console.log(data);
                                                
                                            }).error(function(data, status, headers, config)
                                                     {
                                                         console.log(data);
                                                         
                                                     });
        }
        $scope.coordinators=coordinators;
        console.log(data);
               
    }).error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $scope.del =  function(a)
    {
        if(confirm("Are you sure!") == true)
        {
            $http.delete('/users/'+a).
                success(function(data, status, headers, config) 
                        {
                           $route.reload();
                          // window.location.href = "#/manage-nc";
                            
                        }).
                error(function(data, status, headers, config)
                      {
                          console.log(data);
                      
                      });
            
        }
        else
            return;
         
    }
    
}).controller("add-nc", function($scope, $http, $routeParams, $window, $route) {
    $scope.id = 0;
    $scope.submit = function(isvalid)
    {
        if(isvalid)
        {
            $http.post('/users',{'name' : $scope.name,'email' : $scope.email,'role' : { 'id' : 3 } } ).
                success(function(data, status, headers, config)
                        {
            
                 id = data.id;       
                            $scope.status = "Success";
                            alert(id);
                  $http.post('/nodal_coordinator_details',
                       {"user": {"id": id}, "target_workshops":200,"target_experiments":400,"created_by":{"id": $window.number},
                        "nodal_centre":{"id":12},"target_participants":2000} ).success(function(data, status, headers, config)
                            {
                                                                                                                                                                                                       window.location.href = "#/manage-nc";                                                                                                                                                                                   
                                                                                                                                                                                                                  }).error(function(data, status, headers, config)
                                                                                                                                                                                                                  {
                                                                                                                                                                                                                  });  
                //window.location.href = "#/manage-nc";
                //$scope.message= $routeParams.id;
                
            }).
            error(function(data, status, headers, config)
            {
                if(status == 500)
                {
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400)
                {
                    $scope.status = "Invalid username"
                }
                else
                {
                    $scope.status = "Failed"
                }
            });
            //alert(id);
            
        }
        else
        {
            $scope.status = "Fill Details"
        }
    }
    
}).controller("manage-centres", function($scope, $http, $routeParams, $window, $route) {
    $http.get('/nodal_centres').success(function(data, status, headers, config)
    {
        $scope.centres= data;
        
      
    }).error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $scope.del =  function(a)
    {
        if(confirm("Are you sure!") == true)
        {
            $http.delete('/nodal_centres/'+a).
                success(function(data, status, headers, config) 
                        {
                            $route.reload();
                           
                            
                        }).
                error(function(data, status, headers, config)
                      {
                          console.log(data);
                      
                      });
            
        }
        else
            return;
         
    }
    
}).controller("add-centre", function($scope, $http, $routeParams, $window) {

    $scope.submit = function(isvalid)
    {
        if(isvalid)
        {
            
            $http.post('/nodal_centres',{'name' : $scope.name,'location' : $scope.centre,'created_by' : { 'id' : $window.number } } ).
                success(function(data, status, headers, config)
            {
                $scope.status = "Success";
                window.location.href = "#/manage-centres";
                //$scope.message= $routeParams.id;
                
            }).
            error(function(data, status, headers, config)
            {
                if(status == 500)
                {
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400)
                {
                    $scope.status = "Invalid username"
                }
                else
                {
                    $scope.status = "Failed"
                }
            });
  
        }
        else
        {
            $scope.status = "Fill Details"
        }
    }
}).controller("edit-centre", function($scope, $http, $routeParams, $route, $window) {
  $http.get('/nodal_centres/'+$routeParams.id).
    success(function(data, status, headers, config) 
    {
        $scope.centres= data;
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });

    $scope.submit = function(isvalid) 
    {
        
        if(isvalid)
        {
            
            $http.put('/nodal_centres/'+$routeParams.id, { "name" : $scope.centres.name, "location" : $scope.centres.location,'created_by' : { 'id' : $window.number } }).success(function(data, status, headers, config)
                {
                    $scope.status = "Success";
                    window.location.href = "#/manage-centres";
                                      
                }).
                error(function(data, status, headers, config)
                {
                    if(status == 500)
                    {
                        
                        $scope.status = "Duplicate Email";
                    }
                    else if(status == 400)
                    {
                        $scope.status = "Invalid username"
                    }
                    else
                    {
                        $scope.status = "Failed"
                    }
                    
                });
        }
        else
        {
            $scope.status = "Not empty"
        }
        
    }


});















