angular.module('outreachApp.controllers',[]).
    controller('MapCtrl', function ($scope, $http, dataFactory){
        dataFactory.fetch("/workshops?status_id=1").success(function(workshops){
            $scope.workshops = workshops;
            for(i=0;i<workshops.length;i++){
	        get_geocode(workshops[i].location, (i+1));
            }
        });
        var mapOptions = { zoom: 4, center: new google.maps.LatLng(20,80) };
	$scope.map = new google.maps.Map(document.getElementById('map'), mapOptions);
        var geocoder = new google.maps.Geocoder();
        var get_geocode = function (workshop_location, label){
            geocoder.geocode(
                { "address": workshop_location }, function(results, status) {
                    if (status == google.maps.GeocoderStatus.OK && results.length > 0){
		        var geo_code = results[0].geometry.location;
                        $scope.createMarker(geo_code,workshop_location,label);
        	    }
	        }
            );
        }
        $scope.createMarker = function (geo_code,workshop_location,label){
            var marker = new google.maps.Marker({
                map: $scope.map,
                animation: google.maps.Animation.DROP,
                draggable: true,
                label : String(label),
                position: new google.maps.LatLng(geo_code.lat(), geo_code.lng()),
                title: workshop.location
            });
        }  
        
}).controller("AdminController", function($scope, workshops, dataFactory, $http, $routeParams, $route,$window) {
    dataFactory.fetch("/users/"+$window.number).success(function(response){
        $scope.user = response;
    });
    dataFactory.fetch("/users/"+$routeParams.id).success(function(response){
        $scope.oc_user = response;
                
    });
    dataFactory.fetch("/reference_documents?user_id=1").success(function(response){
        $scope.documents = response;
    });
    $scope.deldoc =  function(id)
    {
        if(confirm("Are you sure!") == true){
            dataFactory.del("/reference_documents/"+id).success(function(response){
                $route.reload();
            }).error(function(data, status){
                
            });
    
        }
    }

    $scope.edit_oc = function(isvalid){
        if(isvalid){
            data = {'name' : $scope.oc_user.name,'email' : $scope.oc_user.email, 'institute_name' : $scope.oc_user.institute_name };
            dataFactory.put("/users/"+$routeParams.id, data).success(function(response){
                history.back();
            }).error(function(data, status, headers, config){
                if(status == 500){
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400){
                    $scope.status = "Invalid username"
                }
                else{
                    $scope.status = "Failed"
                }
            });
            
        }
        else{
            $scope.status = "Fill Details"
        }
    }
    
    $scope.add_oc = function(isvalid){    
        if(isvalid){
            data = {'name' : $scope.name,'email' : $scope.email, 'institute_name' : $scope.inst_name, 'role' : { 'id' : 2 } };
            dataFactory.post("/users", data).success(function(response){
                history.back();
            }).error(function(data, status, headers, config){
                if(status == 500){
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400){
                    $scope.status = "Invalid username"
                }
                else{
                    $scope.status = "Failed"
                }
            });
            
        }
        else{
            $scope.status = "Fill Details"
        }
    }

    $scope.delete_oc =  function(id)
    {
        if(confirm("Are you sure!") == true){
            dataFactory.del("/users/"+id).success(function(response){
                $route.reload();
            }).error(function(data, status){
                alert("You can delete after deleting NC users under him");  
            });
        }
                 
    }
    dataFactory.fetch("/users?role_id=2").success(function(response){
        $scope.totaloc = response.length;
        $scope.oc_users = response;
        
    });
    dataFactory.fetch("/nodal_centres").success(function(response){
        $scope.ncentres = response.length;
    });
    dataFactory.fetch("/users?role_id=3").success(function(response){
        $scope.totalnc = response.length;
        $scope.nc_users = response;
        
    });
    dataFactory.fetch("/workshops?status_id=3").success(function(workshops){
        var count = 0;
        var workshop_list = [];
        var labs = 0;
        for(workshop=0;workshop<workshops.length;workshop++)
        {
            workshop_list.push(workshops[workshop]);
            count = count + workshops[workshop].experiments_conducted;
            labs = labs + workshops[workshop].labs_planned;
        }
        $scope.totalworkshops = workshops.length;
        $scope.totalexpts = count;
        $scope.labs = labs;
        $scope.workshops = workshop_list;
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
                    else if(data[i].status.name == "Pending for Approval" || data[i].status.id == 4)
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
            
            $http.put('/workshops/'+id, {"cancellation_reason" : reason, "status" : {"id": 6} }).
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
  
}).controller("contact-oc", function($scope, $http, $routeParams, $route, $window) {
   
    $http.get('/nodal_coordinator_details?user_id='+$window.number).
    success(function(data, status, headers, config) 
            {
                $scope.oc = data;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
  
}).controller("nc-documents", function($scope, $http, $routeParams, $route, $window) {
   
    $http.get('/reference_documents').
    success(function(data, status, headers, config) 
            {
                $scope.docs = data;
                
                
    }).
    error(function(data, status, headers, config)
    {
      console.log(data);
      
    });
  
}).controller("nodal-centers", function($scope, $http, $routeParams, $route, $window) {
   
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
                       { "name" : $scope.name, "duration_of_sessions" : Number($scope.session), "location" : $scope.location,  "user" : {"id" : $window.number }, "participating_institutes" : $scope.insts,
                         "no_of_participants_expected" : $scope.parti, "no_of_sessions" : Number($scope.sessions),  "labs_planned" : Number($scope.labs),
                         "status" : {"id": 1},  "date" : $scope.date }).
            success(function(data, status, headers, config)
            {
                $scope.status = "Successfully created workshop";
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
  
}).controller("edit-workshop", function($scope, $http, $routeParams, $route, $window) {
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
            $http.put('/workshops/'+$routeParams.id, { "name" : $scope.message.name, "location" : $scope.message.location,  "user" : {"id" : $window.number }, "participating_institutes" : $scope.message.participating_institutes,"no_of_participants_expected" : $scope.message.no_of_participants_expected, "no_of_sessions" : Number($scope.message.no_of_sessions),  "labs_planned" : Number($scope.message.labs_planned),"status" : {"id":1},  "date" : $scope.message.date, "experiments_conducted": $scope.message.experiments_conducted}).success(function(data, status, headers, config)
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
            $scope.status = "All fields are mandatory";
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
    $http.get('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config){
        var coordinators = [];                                                                             
        for( i=0;i<data.length;i++){
            var b = data[i].id;
            //var ncentre = data[i].nodal_centre;
            //  var nc_id=data[i].user.id;
            $http.get('/users/'+ data[i].user.id).success(function(data, status, headers, config){
                data.nc_details_id= b;
                data.nc_user_id=data.id;
                coordinators.push(data);
                
            }).error(function(data, status, headers, config){
                
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
        $scope.ncentre_id = data[0];$scope.email = data.email;
        
    }).error(function(data,status,headers,config){
        console.log("Failed")
    });
    $http.get("/users/"+$routeParams.id).success(function(data, status, headers, config){

        $scope.user = data.name;
        $scope.user_id = data.id;
        $scope.email = data.email;
        $scope.inst_name = data.institute_name;
       
        
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
            $http.post('/users',{'name' : $scope.name,"institute_name" : $scope.inst_name, 'email' : $scope.email,'role' : { 'id' : 3 } } ).
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
                          alert("Delete the nodal coordinator first which is associated with nodal center");
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
                    if (data[i].status.id == 2 || data[i].status.id == 4){
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
    
}).controller("review-reports", function($scope, $http, $routeParams, $route, $window){
    $scope.approve = function(){
        $http.put('/workshops/'+$routeParams.id, {'status': {'id': 3}}).success(function(data, status, headers, config){
            console.log("Status: Approved");
            history.back();
        });
    }
     $scope.disapprove = function(){
         $http.put('/workshops/'+$routeParams.id, {'not_approval_reason': $scope.remarks,'status': {'id': 4}}).success(function(data, status, headers, config){
             console.log("Status: Disapproved");
             history.back();
        });
    }
    $http.get('/workshop_reports?workshop_id='+$routeParams.id).success(function(data,status,headers,config){
        $scope.reports = data;
    }).error(function(data, status, headers, config){
        console.log("Failed");
    });

}).controller("oc-workshop-history", function($scope, $http, $routeParams, $window, $route) {
    var workshops = [] ;
    $http.get('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config){
        for (i = 0 ; i < data.length; i++ ){
            $http.get('/workshops?user_id='+data[i].user.id).success(function(data,status,headers,config){
                for (i=0; i<data.length; i++){
                    if (data[i].status.id == 3){
                        workshops.push(data[i]);
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
     $http.get('/workshops?user_id='+$window.number). success(function(data, status, headers, config) {
               
	        for(i=0;i<data.length;i++){
                    
                    if(data[i].status.id == 3){
                        workshops.push(data[i]);
                    }else{
                        console.log(data[i].name);
                    }
                    
                    
                }
        
    }).error(function(data, status, headers, config){
        console.log(data);
        
    });
    $scope.workshops = workshops;
    
}).controller('testCtrl',function($scope,dataFactory){
    
    dataFactory.fetch("/users").success(function(response){
        $scope.hello = response[1];
        
    });
    var data={name : "sripathi"};
    dataFactory.fetchbyid(data).success(function(response){
        $scope.helloo = response;
       
        });

}).controller("upload-reports", function($scope, $http, $routeParams, $route, $window){
    var photos = [];
    var attendance = [];
    var reports = [];
    $http.get('/workshop_reports?workshop_id='+$routeParams.id).success(function(data,status,headers,config){
        for(i=0;i<data.length;i++){
            if (data[i].name == 'Photos'){
                photos.push(data[i]);
            }else if (data[i].name == 'Attendance'){
                attendance.push(data[i]);
            }else{
                reports.push(data[i]);
            }
        }
    }).error(function(data, status, headers, config){
        console.log("Failed");
    });
    $scope.delreport =  function(id)
    {
        $http.delete('/workshop_reports/'+id).
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
    $scope.photos = photos;
    $scope.attendance = attendance;
    $scope.reports = reports;
});
