
angular.module('outreachApp.controllers',[]).
    controller('mapCtrl', function ($scope, $http)
               {
                   var cities1 = [];
                   $http.get('/workshops')
                       .success(function(data, status, headers, config)
                                {
                                    for(i=0;i<data.length;i++)
                                    {
                                        cities1.push(data[i]);
                                    }
                                    cities();
                                    //console.log(test);
                                    
                                })
                       .error(function(data, status, headers, config)
                              {
                                  console.log(data);
                                  
                              });
                   
                   $scope.upcoming = [];
                   var geocoder = new google.maps.Geocoder();
                   var get_geocode = function (cities,count)
                   {
                       console.log(cities.date);
                       $scope.upcoming.push(cities);
	               geocoder.geocode({ "address": cities.location }, function(results, status) 
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
                   
    var cities = function()
    {
        //console.log(cities1);
        today = new Date();
        var count = 0;
        //console.log(cities1[0].name+""+cities1[0].location);
	for(i=0;i<cities1.length;i++)
	{
            
            date_array = cities1[i].date.split("-");
            //console.log(date_array);
            workshop_date = new Date(Number(date_array[0]), Number(date_array[1])-1, Number(date_array[2]));
            //workshop_date = new Date(2016,12,18);
//            console.log(workshop_date);
	    if((today <= workshop_date) || (today.getDate() == workshop_date.getDate() & (today.getMonth() == workshop_date.getMonth()) 
                                            & (today.getFullYear() == workshop_date.getFullYear())))
            {
		count ++;
                //console.log(cities1[i].date);
		get_geocode(cities1[i],count);
	    }
	    
	}
        
    }
   	
    var mapOptions = { zoom: 4, center: new google.maps.LatLng(20,80) };
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
                title: cities.location
            });
    }  

	
               }).controller("mainController", function($scope, $http, $routeParams,$route) {
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
                            $route.reload();
                            
                        }).
                error(function(data, status, headers, config)
                      {   
                          if(status == 500)
                              alert("You can't delete this user as other users are associated with this account");
                      
                      });
            
        }
        else
            return;
         
    }
    
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
    
    $http.get('/reference_documents?user_id=1').
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

    $http.get('/nodal_centres').
        success(function(data, status, headers, config) 
                {   $scope.ncentres = data.length   })
        . error(function(data, status, headers, config)
                {
                    console.log(data);
                    
                });
   
   $http.get('/users').
    success(function(data, status, headers, config) 
    {  
        var occount = 0;
        var nccount = 0;
        for(i=0;i<data.length;i++)
        {
            if(data[i].role.id == 2)
                occount=occount+1;
            else if(data[i].role.id == 3)
                nccount=nccount+1;
        }
        $scope.totaloc = occount ;
        $scope.totalnc = nccount ;
        console.log(oc-count);
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
   $http.get('/workshops').
    success(function(data, status, headers, config) 
    {  
        var count = 0;
        var expts = 0;
        var labs = 0;
        
        for(i=0;i<data.length;i++)
        {
            if(data[i].status.name == "Approved")
            {
                count=count+1;
                expts = expts + data[i].experiments_conducted;
                labs = labs + data[i].labs_planned;
            }
        }
        $scope.totalworkshops = count ;
        $scope.totalexpts = expts ;
        $scope.labs = labs ;
        

              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
     
    

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

    $http.put('/users/'+$window.number, {'last_active': Date()}).success(function(data, status){ console.log('Status success'); });
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
                    if ((today > workshop_date) & (data[i].status.name == "Upcoming")){
                        $http.put('/workshops/'+workshop_id.toString(), {'status': {'id': 2}}).success(function(data, status){ console.log('Status success'); });
                    }
                    if( (today <= workshop_date) ||(today.getDate() == workshop_date.getDate() & (today.getMonth() == workshop_date.getMonth()) 
                                                    & (today.getFullYear() == workshop_date.getFullYear())))
                    {
                        if(data[i].cancellation_reason == null)
                        {
                            
                            ups.push(data[i]);
                            console.log(ups);
		            upcoming = upcoming + 1;

                        }
	            }
                    else if(data[i].status.name == "Approved")
                    {
                        history.push(data[i]);
                    }
                    else if(data[i].status.name == "Pending for Approval")
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
            var reason = prompt("Please enter your reason");
            
            $http.put('/workshops/'+id, {"cancellation_reason" : reason }).
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
   
    $http.get('/nodal_coordinator_details?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {
                console.log(data[0]);
                $scope.centers = data[0].nodal_centre;
                
                
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
                         "status" : {"id": 1},  "date" : $scope.date }).
            success(function(data, status, headers, config)
            {
                $scope.status = "Success";
                history.back();

                
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
            $http.put('/workshops/'+$routeParams.id, { "name" : $scope.message.name, "location" : $scope.message.location,  "user" : {"id" : $window.number }, "participating_institutes" : $scope.message.participating_institutes,"no_of_participants_expected" : $scope.message.no_of_participants_expected, "no_of_sessions" : Number($scope.message.no_of_sessions),  "labs_planned" : Number($scope.message.labs_planned),"status" : {"id":1},  "date" : $scope.message.date}).success(function(data, status, headers, config)
                {
                    $scope.status = "Success";
                    history.back();
                                      
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


}).controller("oc-dashboard", function($scope, $http, $routeParams, $route, $window) {
    var workshop = 0;
    var participants = 0;
    var experiments = 0;
    $http.put('/users/'+$window.number, {'last_active': Date()}).success(function(data, status){ console.log('Status success'); });
    $http.get("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){
        $scope.ncentres = data.length;
    }).error(function(data,status,headers,config){
        console.log("Failed")
    });
    $http.get('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config)
                                                                                   {   
                                                                                       var coordinators = [];
                                                                                      
        for( i=0;i<data.length;i++)
        {
                       
            $http.get('/workshops?user_id='+ data[i].user.id).success(function(data, status, headers, config)
                                                          {
                                                              for(i=0;i<data.length;i++)
                                                              {
                                                                  if(data[i].status.name == "Approved")
                                                                  {
                                                                      workshop=workshop+1;
                                                                      participants=participants+data[i].participants_attended;
                                                                      experiments=experiments+data[i].experiments_conducted;
                                                                      $scope.workshops=workshop;
                                                                      $scope.participants=participants;
                                                                      $scope.experiments=experiments;
                                                                  }
                                                              }

                                                             
                                                             
                                                
                                            }).error(function(data, status, headers, config)
                                                     {
                                                        // console.log(data);
                                                         
                                                     });
        }
                                                                                       


               
    }).error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    
}).controller("manage-nc", function($scope, $http, $routeParams, $window, $route) {
    $http.get('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config)
                                                                                   {   
        var coordinators = [];                                                                             
        for( i=0;i<data.length;i++)
        {
            //console.log(data[i].user.id);
            var b = data[i].id;
          //  var nc_id=data[i].user.id;
            $http.get('/users/'+ data[i].user.id).success(function(data, status, headers, config)
                                                          {
                                                              data.nc_details_id= b;
                                                              data.nc_user_id=data.id;
                                                coordinators.push(data);
                                                
                                                
                                            }).error(function(data, status, headers, config)
                                                     {
                                                        // console.log(data);
                                                         
                                                     });
        }
        $scope.coordinators=coordinators;
        
               
    }).error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $scope.del =  function(a, b)
    {
        if(confirm("Are you sure!") == true)
        {
            $http.delete('/nodal_coordinator_details/'+a).
                success(function(data, status, headers, config) 
                        {
                           $route.reload();
                          // window.location.href = "#/manage-nc";
                            
                        }).
                error(function(data, status, headers, config)
                      {
                          console.log(data);
                      
                      });
            $http.delete('/users/'+b).
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
    
}).controller("edit-nc", function($scope, $http, $routeParams, $window, $route) {
   
    $http.get("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){

        $scope.ncentres = data;
        $scope.ncentre_id = data[0];
        
    }).error(function(data,status,headers,config){
        console.log("Failed")
    });
    $http.get("/users/"+$routeParams.id).success(function(data, status, headers, config){

        $scope.user = data.name;
        $scope.user_id = data.id;
        $scope.email = data.email;
       
        
    }).error(function(data,status,headers,config){
        console.log("Failed")
    });
    $http.get("/nodal_coordinator_details?user_id="+$routeParams.id).success(function(data, status, headers, config){

        $scope.workshops = data[0].target_workshops;
        $scope.nc_id=data[0].id;
        $scope.expts = data[0].target_experiments;
        $scope.parti = data[0].target_participants;
        console.log($scope.workshops);
       
        
    }).error(function(data,status,headers,config){
        console.log("Failed")
    });
    $scope.id = 0;
    $scope.submit = function(user_id, nc_id)
    {
        
        if(true)
        {
            $http.put('/users/'+user_id,{'name' : $scope.user,'email' : $scope.email} ).
                success(function(data, status, headers, config)
                        {
            
                            id = data.id;       
                            $scope.status = "Success";
                                      
                  $http.put('/nodal_coordinator_details/'+nc_id,
                             {"target_workshops":Number($scope.workshops),"target_experiments":Number($scope.expts), "target_participants":Number($scope.parti),"created_by":{"id": $window.number},
                        "nodal_centre":{"id":$scope.ncentre_id.id}} ).success(function(data, status, headers, config)
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
    
}).controller("add-nc", function($scope, $http, $routeParams, $window, $route) {
    
    $http.get("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){

        $scope.ncentres = data;
        $scope.ncentre_id = data[0];
        
    }).error(function(data,status,headers,config){
        console.log("Failed")
    });
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
                                      
                  $http.post('/nodal_coordinator_details',
                             {"user": {"id": id}, "target_workshops":Number($scope.workshops),"target_experiments":Number($scope.expts), "target_participants":Number($scope.parti),"created_by":{"id": $window.number},
                        "nodal_centre":{"id":$scope.ncentre_id.id}} ).success(function(data, status, headers, config)
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
    $http.get('/nodal_centres?created_by_id='+$window.number).success(function(data, status, headers, config)
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


}).controller("oc-manage-workshops", function($scope, $http, $routeParams, $route, $window) {
   
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
                    if ((today > workshop_date) & (data[i].status.name == "Upcoming")){
                        $http.put('/workshops/'+workshop_id.toString(), {'status': {'id': 2}}).success(function(data, status){ console.log('Status success'); });
                    }
                    if( (today <= workshop_date) ||(today.getDate() == workshop_date.getDate() & (today.getMonth() == workshop_date.getMonth()) 
                                                    & (today.getFullYear() == workshop_date.getFullYear())))
                    {
                        
                        ups.push(data[i]);
                        
		        upcoming = upcoming + 1;
	            }
	        
                    else if(data[i].status.name == "Approved")
                    {
                        history.push(data[i]);
                    }
                    else if(data[i].status.name == "Pending for Approval")
                    {
                        ups.push(data[i]);
                        upcoming = upcoming + 1;
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
  
}).controller("oc-doclist", function($scope, $http, $routeParams, $route, $window) {
    
    $http.get('/reference_documents?user_id=' + $window.number).
    success(function(data, status, headers, config) 
    {
        $scope.documents= data;
              
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
    $http.get('/reference_documents?user_id=1').
        success(function(data, status, headers, config) 
                {
                    $scope.admindocs = data;
                    
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


}).controller("nc-workshops", function($scope, $http, $routeParams, $window, $route) {
    var nc_workshops = []
    $http.get('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config){
        for (i = 0 ; i < data.length; i++ ){
            $http.get('/workshops?user_id='+data[i].user.id).success(function(data,status,headers,config){
                for (i=0; i<data.length; i++){
                    if (data[i].status.id == 2){
                        nc_workshops.push(data[i]);
                    }else{
                        console.log(data[i].name);
                    }
                   
                }
            }).error(function(data,status,headers,config){
                console.log("Failed");
            });
        }
    }).error(function(data, status, headers, config){
        console.log("Failed");
    });
    $scope.workshops = nc_workshops;
    
});















