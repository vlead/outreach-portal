var app = angular.module("outreachApp.controllers",[]);
app.controller("upcoming-ctrl", function ($scope, $http, dataFactory){
      $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'name' },
            { field: 'date' },
            { field: 'participating_institutes'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'upcomingWorkshopsList.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };
    var workshopList = [];
    dataFactory.fetch("/workshops?status_id=1").success(function(workshops){
        var today = new Date();
        for(var i=0;i<workshops.length;i++){
            var workshopDate = new Date(workshops[i].date);
            var workshopId = workshops[i].id ;
            if (((today > workshopDate) & !(today.toDateString() === workshopDate.toDateString())) &
                (workshops[i].status.name === "Upcoming")){
            }else{
                workshopList.push(workshops[i]);
            }
        }
      $scope.IsVisible = false;
      $scope.totalUpcomingWorkshopsList = workshopList.length;
      $scope.IsVisible = true;
      $scope.upcomingWorkshopsList = workshopList;
      $scope.gridOptions.data = $scope.upcomingWorkshopsList;
    });
});
app.controller("map-ctrl", function ($scope, $http, dataFactory){
  dataFactory.fetch("/nodal_centres").success(function(nodalCentre){      
    for(var i=0;i<nodalCentre.length;i++){
      var currentNodalCentre = nodalCentre[i];
      if(currentNodalCentre.location !== "null" && currentNodalCentre.longitude !== null){
	$scope.createMarker(currentNodalCentre, currentNodalCentre, "nodal_centres");
        // getGeocode1(nodalCentre[i]);
      }
    }
  });
  var geocoder1 = new google.maps.Geocoder();
  // var getGeocode1 = function (nodalCentre){
  //   var id = nodalCentre.id;
  //   var location = nodalCentre.location;
  //   geocoder1.geocode(
  //     { "address": nodalCentre.location+",india, Asia" }, function(results, status) {
  //       if (status === google.maps.GeocoderStatus.OK && results.length > 0){
  //         var geoCode = results[0].geometry.location;
  //         var lat = geoCode.lat();
  //         var lng = geoCode.lng();
  //         var data = {"longitude" : lng, "lattitude" : lat };
  //         dataFactory.put("/nodal_centres/"+id, data).success(function(response){
  //         });
  //       }
  //       else{
  //         $scope.status = "Failed for id "+ id +"error: " + status;
  //       }
  //     }
  //   );
  // };
  
  var mapOptions = { zoom: 4, center: new google.maps.LatLng(24,80) };
  $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
  var geocoder = new google.maps.Geocoder();
  
  $scope.createMarker = function (label, geoCode,type){
    var nodalCentreInfowindow = new google.maps.InfoWindow({
      content: "<b>Nodal Centre Location : </b>"+label.location+"<br><b>Nodal Centre Name : </b>"+label.name+"<br><b>Outreach Centre Name : </b>"+label.created_by.institute_name
    });
    var marker = new google.maps.Marker({
      map: $scope.map,
      animation: google.maps.Animation.DROP,
      draggable: false,
      icon : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
      position: new google.maps.LatLng(geoCode.lattitude, geoCode.longitude),
      title: "Click here to view the Nodal Centre details"
    });
    marker.addListener("click", function() {
      nodalCentreInfowindow.open(map, marker);
    });
    // var a = 0;
    //   if(type === "workshops")
    //   {
    //     alert("dfd");
    //     var marker = new google.maps.Marker({
    //       map: $scope.map,
    //       animation: google.maps.Animation.DROP,
    //       draggable: false,
    //       icon: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
    //       position: new google.maps.LatLng(geoCode.lattitude, geoCode.longitude),
    //       title: "Click here to view the workshop details"
    //     });
    //     marker.addListener("click", function() {
    //         workshop_infowindow.open(map, marker);
    //     });
    //   }
    //   else{
    //     marker = new google.maps.Marker({
    //       map: $scope.map,
    //       animation: google.maps.Animation.DROP,
    //       draggable: false,
    //       icon : "http://maps.google.com/mapfiles/ms/icons/green-dot.png",
    //       position: new google.maps.LatLng(geoCode.lattitude, geoCode.longitude),
    //       title: "Click here to view the Nodal Centre details"
    //     });
    //     marker.addListener("click", function() {
    //       nodalCentreInfowindow.open(map, marker);
    //     });
    //   }
};

});

app.controller("nodal-centers-list", function($scope, $http, $routeParams, dataFactory, $route, $window){
    dataFactory.fetch("/total_ncenters").success(function(data,status,headers,config){
	$scope.ncenters = data;
    }).error(function(response){console.log("Failed to fetch total ncenters");
    });

});

app.controller("nodal-center", function($scope, dataFactory, $http, $routeParams, $location, $route, $q, $window) {
    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
          { field: 'created_by.institute_name', displayName: 'Institute'},
          { field: 'name' },
          { field: 'centre_status', displayName:'Status'},
          { field: 'location' }
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'nodalCenter.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };
    dataFactory.fetch("/nodal_centres?created_by_id="+$routeParams.id).success(function(response){
        $scope.nodalCenter = response;
        $scope.gridOptions.data = $scope.nodalCenter;
    }).error(function(response){console.log("Failed to fetch data");});
});

app.controller("oc-ctrl", function($scope, $routeParams, dataFactory, $route, $window){
    dataFactory.fetch("/users/"+$routeParams.id).success(function(response){
	$scope.ocUser = response;
	
    }).error(function(response){console.log("Failed to fetch data");});
    
    $scope.editOC = function(isvalid){
        if(isvalid){
           var data = {"name" : $scope.ocUser.name,"email" : $scope.ocUser.email, "institute_name" : $scope.ocUser.institute_name };
            dataFactory.put("/users/"+$routeParams.id, data).success(function(response){
                history.back();
            }).error(function(data, status, headers, config){
                if(status == 500){
                    $scope.status = "Duplicate Entry";
                }
                else if(status == 400){
                  $scope.status = "Invalid username";
                }
                else{
                  $scope.status = "Failed";
                }
            });

        }
        else{
          $scope.status = "Fill Details";
        }
    };

});
app.controller("usage-ctrl", function($scope, dataFactory, $http, $routeParams, $route, $q, $window) {
    $scope.loading = true;
    $scope.gridOptions = {
        paginationPageSizes: [5, 10],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'institute_name' },
            { field: 'total_usage' }
        ],
        enableGridMenu: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,

        enableSelectAll: true,
        exporterCsvFilename: 'usageList.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };
    dataFactory.fetch("/institute_analytics").success(function(response){
        $scope.usages = response;
        $scope.gridOptions.data = $scope.usages;
        $scope.loading = false;
    }).error(function(response){console.log("Failed to fetch data");});
});

app.controller("participants-ctrl", function($scope, dataFactory, $http, $routeParams, $route, $q, $window) {
    $scope.loading = true;
    dataFactory.fetch("/institute_analytics").success(function(response){
	$scope.usages = response;
	$scope.loading = false;
    }).error(function(response){console.log("Failed to fetch data");});
});

app.controller("one-workshop", function($scope, dataFactory, $http, $routeParams, $route, $q, $window) {
  $scope.loading = true;
  dataFactory.fetch("/workshops/"+$routeParams.id).success(function(response){
    $scope.workshop = response;
    $scope.loading = false;
  }).error(function(response){console.log("Failed to fetch data");});
});

app.controller("workshop", function($scope, dataFactory, $http, $routeParams, $location, $route, $q, $window) {
    $scope.view = function(row) {
        window.location.href = "#/one-workshop/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.institute_name', displayName: 'Institute'},
            { field: 'location' },
            { field: 'version' },
            { field: 'date'},
            { field: 'participants_attended'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="editBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.view(row.entity)" >View</button>'}                     
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'workshopList.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };
  $scope.loading = true;
  dataFactory.fetch("/workshops?status_id=3").success(function(response){
    var workshops = response;
    $scope.loading = false;
    var oc_workshops = workshops.filter(workshop => workshop.user.id == $routeParams.id);
    dataFactory.fetch("/nodal_coordinator_details?created_by_id="+$routeParams.id).success(function(response){
      var ncs = response;
      for(var nc_user=0;nc_user<ncs.length;nc_user++){
        var nc_workshops = workshops.filter(workshop => workshop.user.id == ncs[nc_user].user.id);
        oc_workshops = oc_workshops.concat(nc_workshops);
      }
      $scope.oc_workshops = oc_workshops;
      $scope.gridOptions.data = $scope.oc_workshops;
      dataFactory.fetch("/workshop_reports").success(function(data,status,headers,config){
        var reports = [];
        for(var i=0;i<$scope.oc_workshops.length;i++){
          reports = [];
          for(var j=0;j<data.length;j++){
            if($scope.oc_workshops[i].id == data[j].workshop.id){
              reports.push({"name" : data[j].name, "path" :  data[j].path});
              //console.log("true");                                                                                                                  
            }
          }
          $scope.oc_workshops[i]["reports"] = reports;

        }

      }).error(function(data, status, headers, config){
        console.log("Failed2");
      });
    }).error(function(response){console.log("Failed to fetch data");});
  }).error(function(response){console.log("Failed to fetch data");});
});

app.controller("workshop-list", function($scope, dataFactory, $http, $routeParams, $location, $route, $q, $window) {
    $scope.loading = true;
    dataFactory.fetch("/workshops?status_id=3").success(function(response){
      var workshops = response;
      $scope.loading = false;
      var oc_workshops = workshops.filter(workshop => workshop.user.id == $routeParams.id);
      dataFactory.fetch("/nodal_coordinator_details?created_by_id="+$routeParams.id).success(function(response){
	var ncs = response;
        for(var nc_user=0;nc_user<ncs.length;nc_user++){
          var nc_workshops = workshops.filter(workshop => workshop.user.id == ncs[nc_user].user.id);
          oc_workshops = oc_workshops.concat(nc_workshops);
        }
        $scope.oc_workshops = oc_workshops;
        dataFactory.fetch("/workshop_reports").success(function(data,status,headers,config){
          var reports = [];
          for(var i=0;i<$scope.oc_workshops.length;i++){
            reports = [];
            for(var j=0;j<data.length;j++){
              if($scope.oc_workshops[i].id == data[j].workshop.id){
                reports.push({"name" : data[j].name, "path" :  data[j].path});
                //console.log("true");                                                                                                    
              }
            }
            $scope.oc_workshops[i]["reports"] = reports;
            
          }
          
        }).error(function(data, status, headers, config){
          console.log("Failed2");
        });
      }).error(function(response){console.log("Failed to fetch data");});
    }).error(function(response){console.log("Failed to fetch data");});
  });

app.controller("nc-ctrl", function($scope, $http, $routeParams, dataFactory,$route, $window) {
    $scope.viewNC = function(row) {
        window.location.href = "#/nc-user-list/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'institute', displayName: 'Institute'},
            { field: 'total_ncs', displayName: 'Total Nodal Coordinators', enableFiltering:false},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.viewNC(row.entity)">View</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'totalNCList.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };
  dataFactory.fetch("/users?role_id=2").success(function(response){
    $scope.totaloc = response.length;
    $scope.oc_users = response;
   var oc_users_with_ncs = [];
    //start here v2.4.0                                                                                                                               
    var count = 0;
    var count1 = 0;
    for(var user=0;user<$scope.totaloc;user++){
      dataFactory.fetch("/nodal_coordinator_details?created_by_id="+response[user].id).success(function(data){
        count = count +1 ;
        var temp_dict = [{"institute_name" : "NIT Surathkal" }];
        if(data.length!=0){
          var institute = data[0].created_by.institute_name;
          var id = data[0].created_by.id;
          var dict = { "id" : id, "institute" : institute, "total_ncs" : data.length };
          oc_users_with_ncs.push(dict);
        }
        else{
          dict = {"id" : response[count].id, "institute" : temp_dict[0].institute_name, "total_ncs" : 0};
          console.log(dict);
        }

      });
      $scope.oc_users_with_ncs = oc_users_with_ncs;
    }

    $scope.gridOptions.data = $scope.oc_users_with_ncs;
    //end here                                                                                                                                        
  }).error(function(data, status, headers, config){
      console.log(data);
  });

});


app.controller("admin-ctrl", function($scope, dataFactory, $http, $routeParams, $location, $route, $q, $window) {
  $scope.loading = true;
  $scope.editOC = function(row) {
    window.location.href = "#/edit-oc/" + row['id'];
  };

  $scope.gridOptions = {
    paginationPageSizes: [5, 10, 15],
    paginationPageSize: 5,
    enableFiltering: true,
    columnDefs: [
      { field: 'name', displayName: 'Coordinator Name'},
      { field: 'name', displayName: 'Workshop Name' },
      { field: 'email' },
      { field: 'institute_name',displayName:'Institute Name' },
      { field: 'last_active', displayName:'Last Active'},
      { field: 'created', displayName:'Created On'},
      {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.editOC(row.entity)">Edit</button><button id="deleteBtn" type="button" class="btn btn-small btn-danger" ng-click="grid.appScope.deleteOC(row.entity)">Remove</button>'}
    ],
    enableGridMenu: true,
    enableSelectAll: true,
    exporterMenuPdf: false,
    exporterMenuExcel: false,
    exporterCsvFilename: 'ocList.csv',
    exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
    onRegisterApi: function (gridApi) {
      $scope.grid1Api = gridApi;
    }
  };
  $scope.showParticipants = function(){
    window.open("/participants");
  };
  $scope.showNcentres = function(){
    window.open("/ncentres");
  };
  $scope.showUsage = function(){
    window.open("/usage");
  };
  $scope.showWorkshops = function(){
    window.open("/ws_details");
  };
    
  if ($window.number != 0 || $window.number == undefined) {
    dataFactory.fetch("/users/"+$window.number).success(function(response){
      $scope.user = response;
    }).error(function(response){console.log("Failed to fetch data");});

  }
  dataFactory.fetch("/reference_documents?user_id=1").success(function(response){
    $scope.documents = response;
  }).error(function(response){console.log("Failed to fetch data");});
  
  $scope.deldoc =  function(id)
  {
    if(confirm("Are you sure!") == true){
      dataFactory.del("/reference_documents/"+id).success(function(response){
        $route.reload();
      }).error(function(data, status){
      });
    }
  };
    
  $scope.add_oc = function(isvalid){    
    if(isvalid){
      var data = {"name" : $scope.name,"created" : Date(), "email" : $scope.email, "institute_name" : $scope.inst_name, "role" : { "id" : 2 } };
      dataFactory.post("/users", data).success(function(response){
        history.back();
      }).error(function(data, status, headers, config){
        if(status == 500){
          $scope.status = "Duplicate Entry";
        }
        else if(status == 400){
          $scope.status = "Invalid username";
        }
        else{
          $scope.status = "Failed";
        }
      });
            
    }
    else{
      $scope.status = "Fill Details";
    }
  };
    
  $scope.deleteOC =  function(row)
  {
    if(confirm("Are you sure!") == true){
      dataFactory.del("/users/"+row['id']).success(function(response){
       $route.reload();
      }).error(function(data, status){
        alert("You can delete after deleting NC users under him");  
      });
    }
    
  };
  $scope.goToLink = function(id) {
    window.location.href = "#/nc-user-list/" + id;
  };

  dataFactory.fetch("/users?role_id=2").success(function(response){
    // $scope.totaloc = response.length;
    $scope.oc_users = response;
    $scope.gridOptions.data = $scope.oc_users;
    $scope.loading = false;

    var oc_users_with_ncs = [];
    //start here v2.4.0
    var count = 0;
    var count1 = 0;
    for(var user=0;user<response.length;user++){
      dataFactory.fetch("/nodal_coordinator_details?created_by_id="+response[user].id).success(function(data){
	count = count +1 ;		
	var temp_dict = [{"institute_name" : "NIT Surathkal" }];
	if(data.length!=0){
	  var institute = data[0].created_by.institute_name;
	  var id = data[0].created_by.id;
	  var dict = { "id" : id, "institute" : institute, "total_ncs" : data.length };
	  oc_users_with_ncs.push(dict);
	}
	else{
	  dict = {"id" : response[count].id, "institute" : temp_dict[0].institute_name, "total_ncs" : 0};
	  console.log(dict);	    
	}
		
      });
      $scope.oc_users_with_ncs = oc_users_with_ncs;
    }

    //end here
        
  });

  $scope.nloading = true;
  dataFactory.fetch("/total_ncenters").success(function(response){
    $scope.nloading=false;
    $scope.nodal_centres = response.length;
    $scope.nodal_centres_list = response;
  });

  $scope.nloading = true;
  dataFactory.fetch("/nodal_centres").success(function(response){
    $scope.nloading=false;
    $scope.total_ncentres = response.length;
  });

  // dataFactory.fetch("/workshops?status_id=1").success(function(response){
  //   $scope.upcomingWorkshops = response.length;
  // });
    
  dataFactory.fetch("/nodal_coordinator_details").success(function(response){
    // $scope.totalnc = response.length;
    $scope.nc_users = response;
    
  });

  dataFactory.fetch("/analytics/1").success(function(response){
    $scope.IsVisible = false;
    $scope.totalWorkshops = response.total_value;
    $scope.IsVisible = true;
  });

  dataFactory.fetch("/analytics/2").success(function(response){
    $scope.IsVisible = false;
    $scope.upcomingWorkshops = response.total_value;
      $scope.IsVisible = true;
  });

  dataFactory.fetch("/analytics/3").success(function(data){
    $scope.IsVisible = false;
    $scope.totalNodalCentres = data.total_value;
    $scope.IsVisible = true;
  });

  dataFactory.fetch("/analytics/4").success(function(data){
    $scope.IsVisible = false;
    $scope.totalParticipants = data.total_value;
    $scope.IsVisible = true;
  });

  dataFactory.fetch("/analytics/5").success(function(response){
    $scope.IsVisible = false;
    $scope.totalUsage = response.total_value;
    $scope.IsVisible = true;
  });

  dataFactory.fetch("/analytics/6").success(function(response){
      $scope.IsVisible = false;
      $scope.totalOC = response.total_value;
      $scope.IsVisible = true;
  });

  dataFactory.fetch("/analytics/7").success(function(response){
      $scope.IsVisible = false;
      $scope.totalNC = response.total_value;
      $scope.IsVisible = true;
  });

  $scope.load_analytics = true;
  dataFactory.fetch("/workshops?status_id=3").success(function(workshops){
    var participants_count = 0;
    var workshopList = [];
    var labs = 0;
    var expts_count = 0;
    for(var workshop=0;workshop<workshops.length;workshop++)
    {
      workshopList.push(workshops[workshop]);
      participants_count = participants_count + workshops[workshop].participants_attended;
      labs = labs + workshops[workshop].labs_planned;
      expts_count = expts_count + workshops[workshop].experiments_conducted;
    }
    $scope.total_workshops = workshops.length;
    $scope.total_participants = participants_count;
    $scope.total_usage = expts_count;
    $scope.labs = labs;
    $scope.workshops = workshopList;
    $scope.load_analytics = false;
  });
   
    /*Institute wise usage*/
  // var usage=0;
  // var nc_usage=[];
  // $scope.usageloading = true;
  // dataFactory.fetch("/users"). success(function(data, status, headers, config) {
  //   $scope.users = data;
  // });    
  // dataFactory.fetch("/nodal_coordinator_details"). success(function(data, status, headers, config) {
	
  //   for(var i=0;i<data.length;i++){
  //     usage=0;
  //     for(var j=0;j<$scope.workshops.length;j++){
  //       if(($scope.workshops[j].user.id == data[i].user.id)){
  //         usage=Number(usage) + Number($scope.workshops[j].experiments_conducted);
  //       }
  //     }
  //     nc_usage.push({"nc_user_id" : data[i].user.name , "oc_id" : data[i].created_by.id, "nc_usage" : usage});
  //   }
  //   $scope.nc_usage = nc_usage;
	
  //   var usage1=0;
  //   var nc_usage1=[];
  //   for(i=0;i<$scope.users.length;i++){
  //     usage1=0;
  //     for(j=0;j<$scope.workshops.length;j++){

  //       if(($scope.workshops[j].user.id == $scope.users[i].id && $scope.users[i].role.id == 2)){
	  
  //         usage1=Number(usage1) + Number($scope.workshops[j].experiments_conducted);
          
  //       }
  //     }
  //     if($scope.users[i].role.id == 2){
  //       nc_usage1.push({"oc_user_name" : $scope.users[i].name ,"oc_usage" : usage1});}
  //   }
  //   $scope.ocs_usage = nc_usage1;
	
  //   var oc_usage = 0;
  //   var usage_count = [];
  //   dataFactory.fetch("/users?role_id=2"). success(function(data, status, headers, config) {
  //     for(i=0;i<data.length;i++){
  //       oc_usage = 0;
  //       for(j=0;j<$scope.nc_usage.length;j++){
  //         if(data[i].id == $scope.nc_usage[j].oc_id){
  //           //oc_usage=Number(oc_usage) + Number($scope.nc_usage[j].nc_usage)+nc_usage1[i].oc_usage;
  //           oc_usage=Number(oc_usage) + Number($scope.nc_usage[j].nc_usage);
  //         }
  //       }
  //       usage_count.push({"oc_centre" : data[i].institute_name , "oc_name" : data[i].name, "oc_email" : data[i].email, "usage" : oc_usage+nc_usage1[i].oc_usage});
  //     }
  //     $scope.oc_usage = usage_count;
  //     $scope.usageloading = false;
  //   });
	
  // }).error(function(data, status, headers, config){
  //   console.log(data);
  // });
});

app.controller("nc-dashboard", function($scope, $http, dataFactory, $routeParams, $route, $window) {

    dataFactory.fetch("/workshops?status_id=1").success(function(workshops){
        var today = new Date();
        for(var i=0;i<workshops.length;i++){
            var workshopDate = new Date(workshops[i].date);
            var workshopId = workshops[i].id ;
            if (((today > workshopDate) & !(today.toDateString() === workshopDate.toDateString())) &
                (workshops[i].status.name === "Upcoming")){
                dataFactory.put('/workshops/'+workshopId.toString(),
                                {'status': {'id': 2}}).success(function(data, status){
                                    console.log('Status success'); });
            }
        }
    });
    
    dataFactory.put("/users/"+$window.number, {"last_active": Date().toLocaleString()}).success(function(response){
    }).error(function(data, status, headers, config){
        if(status == 500){
            $scope.status = "Server error";
        }
        else if(status == 400){
          $scope.status = "Invalid date";
        }
        else{
          $scope.status = "Failed";
        }
    });
    dataFactory.fetch("/workshops?user_id="+$window.number).
        success(function(data, status, headers, config) {
            var count = 0;
            var participants = 0;
            var experiments = 0;
            for(var i=0;i<data.length;i++){
                if (data[i].status.id == 3){
                    count = count +1;
                    participants = data[i].participants_attended + participants;
                    experiments = data[i].experiments_conducted + experiments;
                }
            }
            $scope.participants = participants;
            $scope.experiments = experiments;
            $scope.count = count;
            
        }).
        error(function(data, status, headers, config){        
            console.log(data);
        });
    dataFactory.fetch("/nodal_coordinator_details?user_id="+$window.number).
        success(function(data, status, headers, config) {
            var target_workshops = 0;
            var target_experiments = 0;
            var target_participants = 0;
            for(var i=0;i<data.length;i++){
                target_workshops = data[i].target_workshops + target_workshops;
                target_experiments = data[i].target_experiments + target_experiments;
                target_participants = data[i].target_participants + target_participants;
            }
            $scope.target_workshops = target_workshops;
            $scope.target_experiments = target_experiments;
            $scope.target_participants = target_participants;
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });
    
});
app.controller("workshop-history", function($scope, $http, $routeParams, dataFactory,$route, $window) {
  $scope.editWorkshop = function(row) {
        window.location.href = "#edit-workshop/" + row['id'];
    };
    $scope.view = function(row) {
        window.location.href = "#/one-workshop/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.name', displayName: 'Coordinator Name'},
            { field: 'name', displayName: 'Workshop Name' },                                                      { field: 'location' },
            { field: 'participants_attended' },
            { field: 'date'},
            { field: 'status.name', displayName:'Status'},
            { field: 'experiments_conducted', displayName:'Usage'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.view(row.entity)">View</button><button id="editBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.editWorkshop(row.entity)" >Edit</button><button id="editBtn" type="button" class="btn btn-smallbtn-primary" ng-click="grid.appScope.uploadReports(row.entity)">Edit</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'workshopHistory.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
	    $scope.grid1Api = gridApi;
        }

    };

    dataFactory.fetch('/workshops?user_id='+$window.number).success(function(data, status, headers, config){
        var today = new Date();
        var count = 0;
	var upcoming = [];
        var history = [];
	var pending = [];
        for(var i=0;i<data.length;i++){
            var workshopDate = new Date(data[i].date);
                var workshopId = data[i].id ;
            if (((today > workshopDate) & !(today.toDateString() == workshopDate.toDateString())) &
                (data[i].status.name == "Upcoming")){
                dataFactory.put('/workshops/'+workshopId.toString(),
                                {'status': {'id': 2}}).success(function(data, status){
                                    console.log('Status success'); });
            }
            if( (today <= workshopDate) ||(today.getDate() == workshopDate.getDate() &
                                            (today.getMonth() == workshopDate.getMonth())  &
                                            (today.getFullYear() == workshopDate.getFullYear()))){
                if(data[i].cancellation_reason == null){
                    upcoming.push(data[i]);
                    count = count + 1;
                }
            }
            else if(data[i].status.name == "Approved"){
                history.push(data[i]);
            }
            else if(data[i].status.name == "Pending for Approval" || data[i].status.id == 4){
                pending.push(data[i]);
            }
        }
        $scope.history = history;
        $scope.gridOptions.data = $scope.history;
        $scope.loading = false;
    }).error(function(data, status, headers, config){
        console.log(data);
    });
    $scope.cancel = function(id){
        if(confirm("Are you sure!") == true){
            var reason = prompt("Please enter your reason");
           if(reason == "" || reason == null){
                console.log("Failed!");
            }else{
                dataFactory.put("/workshops/"+id, {"cancellation_reason" : reason, "status" : {"id": 6} }).success(function(data, status, headers, config) {
                    $route.reload();
                }).error(function(data, status, headers, config){
                    console.log(data);
		});
            }

        }
    };
});
              
app.controller("pending-workshops", function($scope, $http, $routeParams, dataFactory,$route, $window) {
  $scope.editWorkshop = function(row) {
        window.location.href = "#edit-workshop/" + row['id'];
    };
    $scope.view = function(row) {
        window.location.href = "#/one-workshop/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
          { field: 'user.name', displayName: 'Coordinator Name'},
          { field: 'location' },
          { field: 'participants_attended' },
          { field: 'date'},
          { field: 'status.name', displayName:'Status'},
          { field: 'experiments_conducted', displayName:'Usage'},
          {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.view(row.entity)">View</button><button id="editBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.editWorkshop(row.entity)" >Edit</button><button id="editBtn" type="button" class="btn btn-smallbtn-primary" ng-click="grid.appScope.uploadReports(row.entity)">Edit</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'pendingWorkshops.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };

    dataFactory.fetch('/workshops?user_id='+$window.number).success(function(data, status, headers, config){
        var today = new Date();
        var count = 0;
        var upcoming = [];
        var history = [];
	var pending = [];
        for(var i=0;i<data.length;i++){
            var workshopDate = new Date(data[i].date);
                var workshopId = data[i].id ;
            if (((today > workshopDate) & !(today.toDateString() == workshopDate.toDateString())) &
                (data[i].status.name == "Upcoming")){
                dataFactory.put('/workshops/'+workshopId.toString(),
                                {'status': {'id': 2}}).success(function(data, status){
                                    console.log('Status success'); });
            }
            if( (today <= workshopDate) ||(today.getDate() == workshopDate.getDate() &
                                            (today.getMonth() == workshopDate.getMonth())  &
                                            (today.getFullYear() == workshopDate.getFullYear()))){
                if(data[i].cancellation_reason == null){
                    upcoming.push(data[i]);
                    count = count + 1;
              }
            }
            else if(data[i].status.name == "Approved"){
                history.push(data[i]);
            }
            else if(data[i].status.name == "Pending for Approval" || data[i].status.id == 4){
                pending.push(data[i]);
            }
        }
        $scope.pending = pending;
        $scope.gridOptions.data = $scope.pending;
        $scope.loading = false;

    }).error(function(data, status, headers, config){
        console.log(data);
    });
    $scope.cancel = function(id){
        if(confirm("Are you sure!") == true){
            var reason = prompt("Please enter your reason");
            if(reason == "" || reason == null){
                console.log("Failed!");
            }else{
                dataFactory.put("/workshops/"+id, {"cancellation_reason" : reason, "status" : {"id": 6} }).success(function(data, status, headers, config) {
                    $route.reload();
                }).error(function(data, status, headers, config){
                    console.log(data);
                });
            }

        }
    };
});


app.controller("manage-workshops", function($scope, $http, $routeParams, dataFactory,$route, $window) {
  $scope.editWorkshop = function(row) {
        window.location.href = "#edit-workshop/" + row['id'];
    };
    $scope.view = function(row) {
        window.location.href = "#/one-workshop/" + row['id'];
    };

      $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.name', displayName: 'Coordinator Name'},
            { field: 'location' },
            { field: 'participants_attended' },
            { field: 'date'},
            { field: 'status.name', displayName:'Status'},
            { field: 'experiments_conducted', displayName:'Usage'},
          {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.view(row.entity)">View</button><button id="editBtn" type="button" class="btn btn-small btn-primary" ng-click="grid.appScope.editWorkshop(row.entity)" >Edit</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'ocWorkshopHistory.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
       onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };


  dataFactory.fetch("/users/"+$window.number).
    success(function(data, status, headers, config){
      $scope.user = data;
    }).
    error(function(data, status, headers, config){
      console.log(data);
    });
  
    dataFactory.fetch('/workshops?user_id='+$window.number).success(function(data, status, headers, config){
        var today = new Date();
        var count = 0;
        var upcoming = [];
        var history = [];
        var pending = [];
	for(var i=0;i<data.length;i++){
            var workshopDate = new Date(data[i].date);
                var workshopId = data[i].id ;
            if (((today > workshopDate) & !(today.toDateString() == workshopDate.toDateString())) &
		(data[i].status.name == "Upcoming")){
                dataFactory.put('/workshops/'+workshopId.toString(),
				{'status': {'id': 2}}).success(function(data, status){
				    console.log('Status success'); });
            }
            if( (today <= workshopDate) ||(today.getDate() == workshopDate.getDate() &
					    (today.getMonth() == workshopDate.getMonth())  &
					    (today.getFullYear() == workshopDate.getFullYear()))){
                if(data[i].cancellation_reason == null){
                    upcoming.push(data[i]);
                    count = count + 1;
		}
	    }
            else if(data[i].status.name == "Approved"){
                history.push(data[i]);
            }
            else if(data[i].status.name == "Pending for Approval" || data[i].status.id == 4){
                pending.push(data[i]);
            }
        }
      $scope.upcoming = upcoming;
      $scope.gridOptions.data = $scope.upcoming;
      $scope.loading = false;
    }).error(function(data, status, headers, config){
	console.log(data);
    });
    $scope.cancel = function(id){
        if(confirm("Are you sure!") == true){
            var reason = prompt("Please enter your reason");
	    if(reason == "" || reason == null){
		console.log("Failed!");
	    }else{
                dataFactory.put("/workshops/"+id, {"cancellation_reason" : reason, "status" : {"id": 6} }).success(function(data, status, headers, config) {
                    $route.reload();
	        }).error(function(data, status, headers, config){
                    console.log(data);
                });
            }

        }
    };
});
app.controller("contact-oc", function($scope, dataFactory, $http, $routeParams, $route, $window) {
    dataFactory.fetch("/nodal_coordinator_details?user_id="+$window.number).
        success(function(data, status, headers, config){
            $scope.oc = data;
        }).
        error(function(data, status, headers, config){    
            console.log(data);
        });
  
});
app.controller("nc-documents", function($scope, dataFactory, $http, $routeParams, $route, $window) {
    
    dataFactory.fetch("/reference_documents?user_id=1").
        success(function(data, status, headers, config) {
            $scope.docsAdmin = data;
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });
    
    dataFactory.fetch("/nodal_coordinator_details?user_id="+$window.number).
        success(function(data, status, headers, config){
	    var OCid = data[0].created_by.id ;
	    dataFactory.fetch("/reference_documents?user_id="+OCid).
		success(function(data, status, headers, config) {
		    $scope.docsOC = data;
		}).
		error(function(data, status, headers, config){
		    console.log(data);
		});
        }).
        error(function(data, status, headers, config){    
            console.log(data);
        });
    
   
   
    
});
app.controller("nodal-centers", function($scope, $http, dataFactory, $routeParams, $route, $window) {
    dataFactory.fetch("/nodal_coordinator_details?user_id="+$window.number).
        success(function(data, status, headers, config) {
            $scope.centers = data[0].nodal_centre;
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });
  
});
app.controller("add-workshop", function($scope, $location, $http, dataFactory,$routeParams, $route, $window){

//added mouse over functionality to the fields of Workshop Name,
//Location of Workshop, Workshop College Name and No of Expected
//Participants.
  dataFactory.fetch("/users/"+$window.number).
    success(function(data, status, headers, config){
      $scope.user = data;
    }).
    error(function(data, status, headers, config){    
      console.log(data);
    });
  
    
dataFactory.fetch("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){
        $scope.ncentres = data;
        $scope.ncentre_id = data[0];
    }).error(function(data,status,headers,config){
      console.log("Failed");
    });
  $scope.targetWorkshopName = function(status)
  {
    if(status == "over")
    {
      $scope.info = "Discipline/Department for which, workshop being conducted such as CSE, ECE, ANY.";
    }
    else{$scope.info="";}
  };
  $scope.targetWorkshopLocation = function(status)
  {
    if(status == "over")
    {
      $scope.info1 = "Town/City and State of the workshop location.";
    }
    else{$scope.info1="";}
  };
  $scope.targetWorkshopCollegeName = function(status)
  {
    if(status == "over")
    {
      $scope.info2 = "College(s) that are participating as a part of the workshop.";
    }
    else{$scope.info2="";}
  };
$scope.targetExpectedParticipants = function(status)
  {
    if(status == "over")
    {
      $scope.info3 = "Expected Students/Faculty that are part of the workshop.";
    }
    else{$scope.info3="";}
  };




$scope.submit = function(isvalid){
      if(isvalid){
            var today = new Date();
            var workshopDate = new Date($scope.date);
            var status_id = 1;
            if((today > workshopDate) & !(today.toDateString() == workshopDate.toDateString())){
              status_id = 2;
            }
            dataFactory.post("/workshops", { "name" : $scope.name,
					     "duration_of_sessions" : $scope.session,
					     "location" : $scope.location,  "user" : {"id" : $window.number },
					     "gateway_ip" : $scope.gateway_ip,
                                             "workshop_status": "Active",
					     "participating_institutes" : $scope.insts,
					     "no_of_participants_expected" : $scope.parti,
					     "no_of_sessions" : Number($scope.sessions),
					     "version" : "online",
					     "labs_planned" : Number($scope.labs),
					     "status" : {"id": status_id},  "date" : $scope.date }).
		success(function(data, status, headers, config){
                    $scope.status = "Successfully created workshop";
                    history.back();
                }).
                error(function(data, status, headers, config){
                    if(status == 500){
                        $scope.status = "Duplicate Entry";
                    }
                    else if(status == 400){
                      $scope.status = "Invalid username";
                    }
                    else {
                      $scope.status = "Failed";
                    }
                });
        }
        else{
          $scope.status = "Fill Details";
        }
    };
    
});

app.controller("edit-workshop", function($scope, dataFactory, $http, $routeParams, $route, $window){
  $scope.init = function(){
    $scope.workshop_status = "Active";
  };

  $scope.changeStatus = function(){
    if ($scope.workshop_status == 'Active'){
      $scope.workshop_status = "Inactive";
    }
    else
    {
      $scope.workshop_status='Active';
    }
  };

  $scope.PaperUsage = function(status)
    {
	if(status == "over")
	{
	    $scope.info = "This number will determine the actual usage of Virtual Labs from a workshop.";
	}
	else{$scope.info="";}
    };
    $scope.Gateway = function(status)
    {
	if(status == "over")
	{
	    $scope.info1 = "By clicking this button, ip address of the workshop location is obtained.  A nodal co-ordinator should save this key while the workshop is conducted.  This is done by copying the ip address obtained into the field 'Gateway IP Address'.  This copied IP address will be the key of the workshop and all the online feedback forms submitted during a workshop are attached to this key.";
	}
	else{$scope.info1="";}
    };
    $scope.Compute = function(status)
    {
	if(status == "over")
	{
	    $scope.info1 = "Gets the usage from the feedback forms submitted during a workshop. Gateway IP is mandatory to calculate the usage from online feedback forms. It determines 'where' the workshop is conducted.";
	    
	}
	else{$scope.info1="";}
    };
    $scope.ComputeOffline = function(status)
    {
	if(status == "over")
	{
	    $scope.info1 = "For the given MAC Address feedback usage would be computed.";
	}
	else{$scope.info1="";}
    };
    $scope.get_gateway_ip = function(){
	var url = "http://feedback.vlabs.ac.in/get_gateway_ip";
	$http.get(url).
        success(function(data, status, headers, config){
	    $scope.gate_way_ip = data.gateway_ip;
	    console.log(data.usage);
	    
        }).
            error(function(data, status, headers, config){
		console.log(data);
        });
	
    };
    $scope.get_usage1 = function()
    {
      console.log($scope.message.mac_addr);
	var url = "http://outreach.base1.vlabs.ac.in/get_usage";
	console.log($scope.message.date);
      var data = {"date": $scope.message.date, "version" : $scope.message.version, "mac_addr" : $scope.message.mac_addr };
	$http.post(url, data, {headers: {'Content-Type': 'application/json'}}).
            success(function(data, status, headers, config){
		$scope.online_usage = data.usage;
		$scope.flag = true;
		$scope.message.experiments_conducted = data.usage;
		console.log(data.usage);
            }).
            error(function(data, status, headers, config){
            });
    };
    $scope.flag = false;
    $scope.get_usage = function()
    {
	//10.4.20.103
	var date = new Date($scope.message.date);
	var day = date.getDate();
	var month = date.getMonth() + 1;
	var year = date.getFullYear();
	var new_date = day+"-"+month+"-"+year;
      var url = "http://feedback.vlabs.ac.in/usage_from_feedback?gateway_ip="+$scope.message.gateway_ip+"&date="+new_date+"&key=defaultkey";
	//url = "http://fp-edx-demo.vlabs.ac.in/usage_from_feedback?gateway_ip=10.4.20.103&date=28-09-2016&key=defaultkey"
	//url = "http://fp-edx-demo.vlabs.ac.in/usage_from_feedback?gateway_ip="+$scope.message.gateway_ip+"&date=28-09-2016&key=defaultkey"
	console.log(url);
	$http.get(url).
        success(function(data, status, headers, config){
	    $scope.online_usage = data.usage;
            $scope.flag = true;
            //$scope.usage = data.usage; 
	    $scope.message.experiments_conducted = data.usage;
            console.log(data.usage);
	    
        }).
            error(function(data, status, headers, config){
		//$scope.online_usage = 10;
		//$scope.message.experiments_conducted = 10;
		console.log(data);

	    
        });
    };
    dataFactory.fetch('/workshops/'+$routeParams.id).
        success(function(data, status, headers, config){
            $scope.message= data;
	   
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });

    $scope.submit = function(isvalid){
      if(isvalid){
	  
            var today = new Date();
            var workshopDate = new Date($scope.message.date);
            var status_id = $scope.message.status.id;
            if((today > workshopDate) & !(today.toDateString() == workshopDate.toDateString())){
              if(status_id == 3){
                status_id = 3;
              }else{
		  if($scope.message.user.role.id == 2){
		      status_id = 3;
		      }
		  else{
                      status_id = 2;
		  }
              }
            }else{
              status_id = 1;
            }

	  console.log($scope.usage);
	  dataFactory.put("/workshops/"+$routeParams.id,
			    { "name" : $scope.message.name,
			      "location" : $scope.message.location,
                              "workshop_status" : $scope.workshop_status,
			      "user" : {"id" : $window.number },
			      "participating_institutes" : $scope.message.participating_institutes,
			      "gateway_ip" : $scope.message.gateway_ip,
			      "participants_attended" : $scope.message.participants_attended,
			      "no_of_sessions" : Number($scope.message.no_of_sessions),
			      "duration_of_sessions": $scope.message.duration_of_sessions,
			      "labs_planned" : Number($scope.message.labs_planned),
			      "version" : $scope.message.version,
			      "status" : {"id": status_id},  "date" : $scope.message.date,
			      "experiments_conducted": $scope.message.experiments_conducted}).
		success(function(data, status, headers, config){
                    $scope.status = "Success";
                    history.back();
		}).
                error(function(data, status, headers, config){
                    if(status == 500){
                        $scope.status = "Internal server error";
                    }
                    else if(status == 400){                    
                      $scope.status = "Invalid username";
                    }
                    else {
                      $scope.status = "Failed";
                    }
                    
                });
        }
        else{
            $scope.status = "All fields are mandatory";
        }
        
    };
    
});
app.controller("oc-dashboard", function($scope, $http, dataFactory, $routeParams, $route, $window) {
    var workshops = 0;
    var participants = 0;
    var experiments = 0;
    var ncentres = 0;
    dataFactory.put("/users/"+$window.number, {"last_active": Date()}).
	success(function(data, status){ console.log("Status success"); });
    dataFactory.fetch("/nodal_coordinator_details?created_by_id="+ $window.number).
	success(function(data, status, headers, config){
            for (var i = 0 ; i < data.length; i++ ){
		dataFactory.fetch('/workshops?user_id='+data[i].user.id).success(function(data,status,headers,config){
                    for (i=0; i<data.length; i++){
			if (data[i].status.name == "Approved"){
			    console.log(workshops);
			    workshops = workshops + 1;
			    console.log(experiments);
                            participants = participants + data[i].participants_attended ;
			    experiments = experiments + data[i].experiments_conducted ;
			    
			}else{
                            console.log(data[i].name);
			}
                    }
                    $scope.workshops = workshops;
		    $scope.participants = participants;
		    $scope.experiments = experiments;
		}).
		    error(function(data,status,headers,config){
			console.log("Failed");
		    });
            }
	}).
	error(function(data, status, headers, config){
        console.log("Failed");
        });
    var ocworkshops=0;
    var ocparticipants=0;
    var ocexperiments=0;
    dataFactory.fetch('/workshops?user_id='+$window.number). success(function(data, status, headers, config) {
        for(var i=0;i<data.length;i++){
            if(data[i].status.name == "Approved"){
		ocworkshops = ocworkshops + 1 ;
	      console.log(experiments);
                ocparticipants = ocparticipants +  data[i].participants_attended ;
		ocexperiments = ocexperiments + data[i].experiments_conducted ;
	        
            }else{
                console.log(data[i].name);
            }
        }
        $scope.ocworkshops =  ocworkshops;
	$scope.ocparticipants = ocparticipants;
	$scope.ocexperiments = 	ocexperiments;
    }).error(function(data, status, headers, config){
        console.log(data);
    });
    dataFactory.fetch("/nodal_centres?created_by_id="+$window.number). success(function(data, status, headers, config) {
	$scope.ncentres = data;
	$scope.ncentres = data.length ;
    }).error(function(data, status, headers, config){
        console.log(data);
    });
  
  
});

app.controller("manage-nc", function($scope, $http, $routeParams, dataFactory, $window, $route) {
    $scope.loading = true;
    $scope.editNodalCoordinator = function(row) {
        window.location.href = "#/edit-nc/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
	enableFiltering: true,
        columnDefs: [
            { field: 'name', displayName: 'Coordinator Name'},
            { field: 'name', displayName: 'Workshop Name' },                                                      { field: 'email' },
            { field: 'phone' },
            { field: 'user_status'},
            // { field: 'created'},                                                                                                                   
            { field: 'last_active', displayName:'Last Active'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.editNodalCoordinator(row.entity)">Edit</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'nodalCoordinators.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };
    dataFactory.fetch("/nodal_coordinator_details?created_by_id="+ $window.number).success(function(data, status, headers, config){
      var coordinators = [];
        for(var i=0;i<data.length;i++){
            var nc_id = data[i].id;
            dataFactory.fetch("/users/"+ data[i].user.id).success(function(data, status, headers, config){
                data.nc_details_id=nc_id;
                data.nc_user_id=data.id;
                coordinators.push(data);
            }).error(function(data, status, headers, config){
            });
        }
        $scope.coordinators=coordinators;
        $scope.gridOptions.data = $scope.coordinators;
        $scope.loading = false;
    }).error(function(data, status, headers, config){
        console.log(data);
    });
  // $scope.del =  function(nc_details_id, user_id){
    $scope.del =  function(row){
        dataFactory.fetch("/workshops?user_id="+user_id).
                success(function(data, status, headers, config){ 
                    if(data.length == 0)
                    	{
                    	   if(confirm("Are you sure!") == true){
            			dataFactory.del("/nodal_coordinator_details/"+nc_details_id).
                		success(function(data, status, headers, config){ 
                    		$route.reload();
                		}).
                		error(function(data, status, headers, config){
                		 console.log(data);
                		});
            			dataFactory.del("/users/"+ user_id).
                		success(function(data, status, headers, config) {
                    		$route.reload();
                		}).
        			error(function(data, status, headers, config){
                    		console.log(data);
                		});
        			}
        		$route.reload();
                    	}
                    	else {
                    		alert("Can't delete user !! Since the workshops are associated with this user and to delete this user delete workshops under him first");
                    		$route.reload();
                    	}
                }).
                error(function(data, status, headers, config){
                    console.log(data);
                });
      
    };
    
});
app.controller("edit-nc", function($scope, dataFactory, $http, $routeParams, $window, $route) {
  $scope.init = function(){
    $scope.user_status = "Active";
  };

  $scope.changeStatus = function(){
    if ($scope.user_status == 'Active'){
      $scope.user_status = "Inactive";
    }
    else
    {
      $scope.user_status='Active';
    }
  };

  $scope.flag1=true;
    $scope.change = function()
    {
        $scope.flag2 = true;
        $scope.flag1 = false;
    };
    $scope.donotchange = function()
    {

        $scope.flag2 = false;
        $scope.flag1 = true;
    };

    dataFactory.fetch("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){
        $scope.ncentres = data;
        $scope.ncentre_id = data[0];
        //$scope.email = data.email;
    }).error(function(data,status,headers,config){
      console.log("Failed");
    });
    dataFactory.fetch("/users/"+$routeParams.id).success(function(data, status, headers, config){
        $scope.user = data.name;
        $scope.user_id = data.id;
        $scope.email = data.email;
        $scope.phone = data.phone;
        $scope.inst_name = data.institute_name;
    }).error(function(data,status,headers,config){
      console.log("Failed");
    });
    dataFactory.fetch("/nodal_coordinator_details?user_id="+$routeParams.id).success(function(data, status, headers, config){
	$scope.ncentre = data[0].nodal_centre.location;
	$scope.ncentre_name = data[0].nodal_centre.name;
        $scope.workshops = data[0].target_workshops;
        $scope.nc_id=data[0].id;
        $scope.expts = data[0].target_experiments;
        $scope.parti = data[0].target_participants;
        console.log($scope.workshops);
    }).error(function(data,status,headers,config){
      console.log("Failed");
    });
    $scope.id = 0;
    $scope.submit = function(user_id, nc_id){
        if(true){
          dataFactory.put("/users/"+user_id,{"name" : $scope.user,"email" : $scope.email, "user_status": $scope.user_status, "phone" : $scope.phone} ).
                success(function(data, status, headers, config){
                    var id = data.id;       
                    $scope.status = "Success";
                    dataFactory.put("/nodal_coordinator_details/"+nc_id,
                                    {"target_workshops":Number($scope.workshops),
                                     "target_experiments":Number($scope.expts),
                                     "target_participants":Number($scope.parti),
                                     "created_by":{"id": $window.number},
                                     "nodal_centre":{"id":$scope.ncentre_id.id}}
                                   )
                        .success(function(data, status, headers, config){
                            window.location.href = "#/manage-nc";                                                                                                                                     }).error(function(data, status, headers, config){
                            });  
                }).
                error(function(data, status, headers, config){
                    if(status == 500){
                        $scope.status = "Duplicate Entry";
                    }
                    else if(status == 400){
                      $scope.status = "Invalid username";
                    }
                    else{
                      $scope.status = "Failed";
                    }
                });
        }
        else {
          $scope.status = "Fill Details";
        }
    };
    
});

app.controller("add-nc", function($scope, $http, dataFactory, $routeParams, $window, $route) {
    dataFactory.fetch("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){
        $scope.ncentres = data;
        $scope.ncentre_id = data[0];
    }).error(function(data,status,headers,config){
      console.log("Failed");
    });
  $scope.targetWorkshops = function(status)
  {
    if(status == "over")
    {
      $scope.info = "A workshop that is intended to be conducted whose objectives,date ,subject matter such as name of the labs and experiments,  location, participants and other relevant parameters are defined well in advance enabling it to be organized.";
    }
    else{$scope.info="";}
  };
  $scope.targetExperiments = function(status)
  {
    if(status == "over")
    {
      $scope.info1 = "An experiment that is intended to be conducted or done whose objectives, date ,subject matter such as name of the  experiment,  location, participants and other relevant parameters are defined well in advance enabling  it to be organized.";
    }
    else{$scope.info1="";}
  };
  $scope.targetParticipants = function(status)
  {
    if(status == "over")
    {
      $scope.info2 = "Set of people participating in a workshop or an experiment who meet the technical and other requirements that  enable them to fulfill the objectives of the workshop or experiment.";
    }
    else{$scope.info2="";}
  };

    $scope.id = 0;
    $scope.submit = function(isvalid){
        if(isvalid){
          dataFactory.post("/users",{"name" : $scope.name, "created" : Date(), "email" : $scope.email, "phone" : $scope.phone, "user_status":"Active", "role" : { "id" : 3 } } ).
            success(function(data, status, headers, config){
                    var id = data.id;       
                    $scope.status = "Success";
                    dataFactory.post("/nodal_coordinator_details",
                                     {"user": {"id": id},
                                      "target_workshops":Number($scope.workshops),
                                      "target_experiments":Number($scope.expts),
                                      "target_participants":Number($scope.parti),
                                      "created_by":{"id": $window.number},
                                      "nodal_centre":{"id":$scope.ncentre_id.id}} ).success(function(data, status, headers, config){
                                          window.location.href = "#/manage-nc";                                                                                                                                    }).error(function(data, status, headers, config){
                                          });  
                }).
                error(function(data, status, headers, config){
                    if(status == 500){
                        $scope.status = "Duplicate Entry";
                    }
                    else if(status == 400){
                      $scope.status = "Invalid username";
                    }
                  else {
                      $scope.status = "Failed";
                    }
                });
        }
        else {
          $scope.status = "Fill Details";
        }
    };
    
});
app.controller("manage-centres", function($scope, $http, dataFactory, $routeParams, $window, $route) {
    $scope.loading = true;
    $scope.editCentre = function(row) {
        window.location.href = "#/edit-centre/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'name', displayName: 'Name'},
            { field: 'location' },
            { field: 'pincode' },
            { field: 'centre_status', displayName:'Status'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.editCentre(row.entity)">Edit</button><button id="deleteBtn" type="button" class="btn btn-small btn-danger" ng-cl\
ick="grid.appScope.del_centre(row.entity)" >Remove</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'manageCentres.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };
    dataFactory.fetch("/nodal_centres?created_by_id="+$window.number).success(function(data, status, headers, config){
      $scope.centres= data;
      $scope.gridOptions.data = $scope.centres;
      $scope.loading = false;
    }).error(function(data, status, headers, config){
        console.log(data);
    });
    $scope.add_centre = function(isvalid){
	if(isvalid){
        var add = function(lat, lng){
          dataFactory.post("/nodal_centres",
                           {"name" : $scope.name,
                            "pincode" : $scope.pincode,
                            "centre_status": "Active",
                            "location" : $scope.centre,
			    "lattitude" : lat,
                            "longitude" : lng,
                            "created_by" : { "id" : $window.number } } ).
            success(function(data, status, headers, config){
              $scope.status = "Success";
              window.location.href = "#/manage-centres";
            }).
            error(function(data, status, headers, config){
              if(status == 500){
                $scope.status = "Duplicate Entry";
              }
              else if(status == 400){
                $scope.status = "Invalid username";
              }
              else{
                $scope.status = "Failed";
              }
            });
        };
          var geocoder = new google.maps.Geocoder();
	  /*var get_geocode = function (){
          
	    var google_maps_api = "https://maps.googleapis.com/maps/api/geocode/json";
	    var address = $scope.centre+","+$scope.pincode+",India,Asia";
	    var key = "AIzaSyCQn4kTT5n9vKDPoRoaqVzzyD43xAGe2l8";
	    var api_url = google_maps_api +"?"+"address="+address+"&key="+key;
            console.log(api_url);
	    dataFactory.fetch(api_url).success(function(data, status, headers, config){
	      var lat = data.results[0].geometry.location.lat;
              var lng = data.results[0].geometry.location.lng;
              console.log("Success=: "+status);
              add(lat, lng);
              
	    }).error(function(data, status, headers, config){
              add("0","0");
              console.log("failed for id error: "+status);
	    });
	    */
            var get_geocode = function (){
          geocoder.geocode(
            { "address": $scope.centre+","+$scope.pincode+",India,Asia" }, function(results, status) {
              if (status === google.maps.GeocoderStatus.OK && results.length > 0){
                  var geoCode = results[0].geometry.location;
                  var lat = geoCode.lat();
                  var lng = geoCode.lng();
		  console.log("lat="+lat+"lng="+lng);
                  add(lat, lng);
              }
              else{
                add("0","0");
                console.log("failed for id error: "+status);
              }
            }
          );
                                         };
	
      get_geocode();
        }
        else{
          $scope.status = "Fill Details";
        }
    };
    $scope.del_centre =  function(row){
        if(confirm("Are you sure!") == true){
            dataFactory.del("/nodal_centres/"+row['id']).
                success(function(data, status, headers, config) {
                    $route.reload();
                }).
                error(function(data, status, headers, config){
                    alert("Delete the nodal coordinator first which is associated with nodal center");
                    console.log(data);
                });
        }
    };
    
});

app.controller("edit-centre", function($scope, dataFactory, $http, $routeParams, $route, $window) {
  $scope.init = function(){
    $scope.centre_status = "Active";
  };

  $scope.changeStatus = function(){
    if ($scope.centre_status == 'Active'){
      $scope.centre_status = "Inactive";
    }
    else
    {
      $scope.centre_status='Active';
    }
  };
  dataFactory.fetch("/nodal_centres/"+$routeParams.id).
    success(function(data, status, headers, config) {
      $scope.centres= data;
    }).
    error(function(data, status, headers, config){
      console.log(data);
    });
  $scope.submit = function(isvalid) {
    if(isvalid){
      var add = function(lat,lng){
        dataFactory.put("/nodal_centres/"+$routeParams.id,
                        { "name" : $scope.centres.name,
                          "longitude" : lng,
                          "lattitude" : lat,
                          "centre_status": $scope.centre_status,                          
			  "pincode" : $scope.centres.pincode,
                          "location" : $scope.centres.location,
                          "created_by" : { "id" : $window.number } }).success(function(data, status, headers, config){
                            $scope.status = "Success";
                            window.location.href = "#/manage-centres";
                          }).
          error(function(data, status, headers, config){
            if(status == 500){
              $scope.status = "Duplicate Email";
            }
            else if(status == 400){
              $scope.status = "Invalid username";
            }
            else {
              $scope.status = "Failed";
            }
          
          });
      };
      var geocoder = new google.maps.Geocoder();
      var get_geocode = function (){
        geocoder.geocode(
          { "address": $scope.centres.location+","+$scope.centres.pincode+",India,Asia" }, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK && results.length > 0){
              var geoCode = results[0].geometry.location;
              var lat = geoCode.lat();
              var lng = geoCode.lng();
              add(lat, lng);
            }
            else{
              add("0","0");
              console.log("failed for id error: "+status);
            }
          }
        );
      };
      get_geocode();
    }
    else{
      $scope.status = "Not empty";
    }
  };
});
app.controller("oc-manage-workshops", function($scope, $http, $routeParams, dataFactory,$route, $window) {
      $scope.loading = true;
    $scope.ocUploadReports = function(row) {
	window.location.href = "#/oc-upload-reports/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.name', displayName: 'Coordinator Name'},
            { field: 'name', displayName: 'Workshop Name' },                                                      { field: 'location' },
            { field: 'no_of_participants_expected' },
            { field: 'date'},
            { field: 'status.name', displayName:'Status'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.ocUploadReports(row.entity)">Review Reports</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'NCWorkshops.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };

    // dataFactory.fetch("/users/"+$window.number).
    // success(function(data, status, headers, config){
    //   $scope.user = data;
    // }).
    // error(function(data, status, headers, config){
    //   console.log(data);
    // });
    dataFactory.fetch("/workshops?user_id="+$window.number).
	success(function(data, status, headers, config) {
            var today = new Date();
            var count = 0;
            var upcoming = [];
            var history = [];
            var pending = [];
	    for(var i=0;i<data.length;i++){
                var workshopDate = new Date(data[i].date);
                var workshopId = data[i].id ;
                if (((today > workshopDate) & !(today.toDateString() == workshopDate.toDateString())) &
		(data[i].status.name == "Upcoming")){
                    dataFactory.put('/workshops/'+workshopId.toString(), {'status': {'id': 2}}).
			success(function(data, status){ console.log('Status success'); });
                }
                if((today <= workshopDate) ||
		   (today.getDate() == workshopDate.getDate() &
		    (today.getMonth() == workshopDate.getMonth()) 
                    & (today.getFullYear() == workshopDate.getFullYear()))){
                    upcoming.push(data[i]);
                    count = count + 1;
	        }
	        else if(data[i].status.name == "Approved"){
                    history.push(data[i]);
                }
                else if(data[i].status.name == "Pending for Approval"){
                    upcoming.push(data[i]);
                    count = count + 1;
                }
            }
          // $scope.history = history;
          // $scope.pending = pending;
          $scope.upcoming = upcoming;
          $scope.gridOptions.data = $scope.upcoming;
          $scope.loading = false;
          
          $scope.count = count;
          $scope.sort = function(keyname){
            $scope.sortKey = keyname;   //set the sortKey to the param passed
            $scope.reverse = !$scope.reverse; //if true make it false and vice versa
          };

            //    $scope.experiments = experiments;
            //    $scope.count = count;
        }).
	error(function(data, status, headers, config){
	    console.log(data);
	});
    $scope.cancel = function(id){
        if(confirm("Are you sure!") == true){
            var reason = prompt("Please enter your reason");
	    if(reason == "" || reason == null){
		console.log("Failed!");
	    }else{
                dataFactory.put("/workshops/"+id, {"cancellation_reason" : reason, "status" : {"id": 6} }).success(function(data, status, headers, config) {
                    $route.reload();
	        }).error(function(data, status, headers, config){
                    console.log(data);
                });
            }
	    
        }
    };
});
app.controller("oc-doclist", function($scope, $http, $routeParams, dataFactory,$route, $window) {
    dataFactory.fetch("/reference_documents?user_id=" + $window.number).
	success(function(data, status, headers, config) {
            $scope.documents= data;
        }).
	error(function(data, status, headers, config){
	    console.log(data);
        });
    dataFactory.fetch("/reference_documents?user_id=1").
        success(function(data, status, headers, config) {
            $scope.admindocs = data;
        }).
        error(function(data, status, headers, config){
            console.log(data);
        });
    $scope.deldoc =  function(id){
        dataFactory.del("/reference_documents/"+id).
            success(function(data, status, headers, config){
                $scope.status= "Deleted";
                $route.reload();
	    }).
            error(function(data, status, headers, config){
                console.log(data);
            });
    };
});
app.controller("nc-workshops", function($scope, $http, $routeParams, dataFactory, $window, $route) {
    $scope.loading = true;
    $scope.reviewReports = function(row) {
        window.location.href = "#review-reports/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.name', displayName: 'Coordinator Name'},
            { field: 'name', displayName: 'Workshop Name' },                                                      { field: 'location' },
            { field: 'not_approval_reason' },
            { field: 'date'},
            { field: 'status.name', displayName:'Status'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.reviewReports(row.entity)">Review Reports</button>'}
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'ocWorkshopHistory.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }
    };

  var nc_workshops = [];
    dataFactory.fetch('/nodal_coordinator_details?created_by_id='+ $window.number).success(function(data, status, headers, config){
        for (var i = 0 ; i < data.length; i++ ){
            dataFactory.fetch('/workshops?user_id='+data[i].user.id).success(function(data,status,headers,config){
                for (i=0; i<data.length; i++){
                    //if (data[i].status.id == 2 || data[i].status.id == 4){
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
    $scope.gridOptions.data = $scope.workshops;
    $scope.loading = false;

  // $scope.sort = function(keyname){
  //   $scope.sortKey = keyname;   //set the sortKey to the param passed
  //   $scope.reverse = !$scope.reverse; //if true make it false and vice versa
  // };

});
app.controller("review-reports", function($scope, $http, $routeParams, dataFactory,  $route, $window){
    $scope.approve = function(){
        dataFactory.put("/workshops/"+$routeParams.id, {"status": {"id": 3}}).success(function(data, status, headers, config){
            console.log("Status: Approved");
            history.back();
        });
    };
    $scope.disapprove = function(){
        dataFactory.put("/workshops/"+$routeParams.id, {"not_approval_reason": $scope.remarks,
							"status": {"id": 4}}).
	    success(function(data, status, headers, config){
		console.log("Status: Disapproved");
		history.back();
            });
    };
    dataFactory.fetch('/workshops/'+$routeParams.id).success(function(data,status,headers,config){
      $scope.data = data;
      var date = new Date($scope.data.date);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      var new_date = day+"-"+month+"-"+year;
      var url = "http://fp-edx-demo.vlabs.ac.in/usage_from_feedback?gateway_ip="+$scope.data.gateway_ip+"&date="+new_date+"&key=defaultkey";
	//url = "http://fp-edx-demo.vlabs.ac.in/usage_from_feedback?gateway_ip=10.4.20.103&date=28-09-2016&key=defaultkey"
	//url = "http://fp-edx-demo.vlabs.ac.in/usage_from_feedback?gateway_ip="+$scope.message.gateway_ip+"&date=28-09-2016&key=defaultkey"
	
	console.log(url);
	$http.get(url).
        success(function(data, status, headers, config){
	    //$scope.usage = data.usage;
	    $scope.usage_from_online = data.usage;
	    console.log(data.usage);
	    
        }).
            error(function(data, status, headers, config){
		$scope.usage_from_online = 10;
		console.log(data);

	    
        });
	
	
    });
    dataFactory.fetch("/workshop_reports?workshop_id="+$routeParams.id).success(function(data,status,headers,config){
        var photos = [];
	var attendance = [];
	var reports = [];
	
	for(var i=0; i < data.length; i++){
	    if(data[i].name == "Photos"){
		photos.push(data[i]);
	    }else if(data[i].name == "Attendance"){
		attendance.push(data[i]);
	    }else{
		reports.push(data[i]);
	    }
	}
	$scope.photos = photos;
	$scope.attendance = attendance;
        $scope.reports = reports;
    }).error(function(data, status, headers, config){
        console.log("Failed");
    });
});

app.controller("oc-workshop-history", function($scope, $http, $routeParams, dataFactory, $window, $route) {
    $scope.loading = true;
    $scope.viewReports = function(row) {
	window.location.href = "#view-reports/" + row['id'];
    };

    $scope.editWorkshop = function(row) {
        window.location.href = "#edit-workshop/" + row['id'];
    };

    $scope.uploadReports = function(row) {
        window.location.href = "#/oc-upload-reports/" + row['id'];
    };

    $scope.gridOptions = {
        paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.name', displayName: 'Coordinator Name'},
            { field: 'name', displayName: 'Workshop Name' },                            
            { field: 'location' },
            { field: 'participants_attended' },
            { field: 'date'},
            { field: 'status.name', displayName:'Status'},
            { field: 'experiments_conducted', displayName:'Usage'},
            {name: 'actions', enableFiltering: false, displayName: 'Actions', cellTemplate: '<button id="viewBtn" type="button" class="btn btn-small \
btn-primary" ng-click="grid.appScope.viewReports(row.entity)">View</button><button id="editBtn" type="button" class="btn btn-small btn-primary" ng-cl\
ick="grid.appScope.editWorkshop(row.entity)" >Edit</button><button id="editBtn" type="button" class="btn btn-smallbtn-primary" ng-click="grid.appScop\
e.uploadReports(row.entity)">Edit</button>'}   
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'ocWorkshopHistory.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };
  
    var workshops = [] ;
    dataFactory.fetch("/nodal_coordinator_details?created_by_id="+ $window.number).
	success(function(data, status, headers, config){
            for (var i = 0 ; i < data.length; i++ ){
		dataFactory.fetch('/workshops?user_id='+data[i].user.id).success(function(data,status,headers,config){
                    for (i=0; i<data.length; i++){
			if (data[i].status.id == 3){
                            workshops.push(data[i]);
			}else{
                            console.log(data[i].name);
			}
                    }
		}).
		    error(function(data,status,headers,config){
			console.log("Failed");
		    });
            }
	}).
	error(function(data, status, headers, config){
        console.log("Failed");
    });
    dataFactory.fetch('/workshops?user_id='+$window.number). success(function(data, status, headers, config) {
        for(var i=0;i<data.length;i++){
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
  $scope.gridOptions.data = $scope.workshops;
  $scope.loading = false;
  
  // $scope.sort = function(keyname){
  //   $scope.sortKey = keyname;   //set the sortKey to the param passed
  //   $scope.reverse = !$scope.reverse; //if true make it false and vice versa
  // };
});
app.controller("upload-reports", function($scope, $http, $routeParams, dataFactory, $route, $window){
    var photos = [];
    var attendance = [];
    var reports = [];
    dataFactory.fetch('/workshop_reports?workshop_id='+$routeParams.id).success(function(data,status,headers,config){
        for(var i=0;i<data.length;i++){
            if (data[i].name == 'Photos'){
                photos.push(data[i]);
            }else if (data[i].name == "Attendance"){
                attendance.push(data[i]);
            }else{
                reports.push(data[i]);
            }
        }
    }).
	error(function(data, status, headers, config){
            console.log("Failed");
	});
    $scope.delreport =  function(id){
        dataFactory.del("/workshop_reports/"+id).
            success(function(data, status, headers, config) {
                $scope.status= "Deleted";
                $route.reload();
	    }).
            error(function(data, status, headers, config){
                console.log(data);
            });
    };
    $scope.photos = photos;
    $scope.attendance = attendance;
    $scope.reports = reports;
});
app.controller("ws_details", function($scope, $http, $routeParams, dataFactory, $route, $window){
    dataFactory.fetch("/workshops?version=online&status_id=3").success(function(data,status,headers,config){
	$scope.workshops = data;
    }).error(function(data, status, headers, config){
        console.log("Failed1");
    });
    dataFactory.fetch('/workshop_reports').success(function(data,status,headers,config){
      var reports = [];
	for(var i=0;i<$scope.workshops.length;i++){
	  reports = [];
	    for(var j=0;j<data.length;j++){
		if($scope.workshops[i].id == data[j].workshop.id){
		  reports.push({"name" : data[j].name, "path" :  data[j].path});
		    //console.log("true");
		}

	    }
	    $scope.workshops[i]["reports"] = reports;
	}
	
    }).error(function(data, status, headers, config){
        console.log("Failed2");
    });

});
app.controller("ws_reports", function($scope, $http, $routeParams, dataFactory, $route, $window){

    dataFactory.fetch("/workshop_reports?workshop_id="+$routeParams.id).success(function(reports,status,headers,config){

	$scope.reports = reports;
	console.log(reports);
	/*
	for(workshop=0;workshop<workshops.length;workshop++){
	    if(workshops[workshop].id == $routeParams.id){
		var ws_reports = [];
		ws_reports.Photos = [];
		ws_reports.Reports = [];
		ws_reports.Attendance = [];
		for(report=0;report<reports.length;report++){
		    if(reports[report].name == "Photos"){
			ws_reports.Photos.push(reports[report].path)
			
		    }
		    else if(reports[report].name == "Reports"){
			ws_reports.Reports.push(reports[report].path)
			
		    }
		    else
		    {
			ws_reports.Attendance.push(reports[report].path)
		    }
		    
		}
		console.log(ws_reports);
		$scope.name = "sripathi";
		$scope.ws_reports = ws_reports;
	    }
	    
	}
	*/
	
    }).error(function(data, status, headers, config){
        console.log("Failed2");
    });

});
app.controller("ws_details_offline", function($scope, $http, $routeParams, dataFactory, $route, $window){
    dataFactory.fetch("/workshops?version=offline&status_id=3").success(function(data,status,headers,config){
	$scope.offline_workshops = data;
    }).error(function(data, status, headers, config){
        console.log("Failed1");
    });
    dataFactory.fetch("/workshop_reports").success(function(data,status,headers,config){
      var reports = [];
	for(var i=0;i<$scope.offline_workshops.length;i++){
	  reports = [];
	    for(var j=0;j<data.length;j++){
		if($scope.offline_workshops[i].id == data[j].workshop.id){
		  reports.push({"name" : data[j].name, "path" :  data[j].path});
		    //console.log("true");
		}

	    }
	    $scope.offline_workshops[i]["reports"] = reports;
	    
	}
	
    }).error(function(data, status, headers, config){
        console.log("Failed2");
    });

});

app.controller("nc-user-list", function($scope, $http, $routeParams, dataFactory, $route, $window){
   $scope.gridOptions = {
	paginationPageSizes: [5, 10, 15],
        paginationPageSize: 5,
        enableFiltering: true,
        columnDefs: [
            { field: 'user.name', displayName: 'Name'},
            { field: 'user.email', displayName: 'Email'},
            { field: 'user.last_active', displayName: 'Last Active', enableFiltering:false}  
        ],
        enableGridMenu: true,
        enableSelectAll: true,
        exporterMenuPdf: false,
        exporterMenuExcel: false,
        exporterCsvFilename: 'totalNCList.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        onRegisterApi: function (gridApi) {
            $scope.grid1Api = gridApi;
        }

    };
  dataFactory.fetch("/nodal_coordinator_details?created_by_id="+ $routeParams.id).
	success(function(data, status, headers, config){
	  $scope.nc_user_list = data;
          $scope.gridOptions.data = $scope.nc_user_list;
          $scope.loading = false;
	}).
	error(function(data,status,headers,config){
	    console.log("Failed to load nodal coordinator details");
	});
});


/*export button function*/

// $(document).ready(function){
// var table = $('#example').DataTable({
// lengthChange: false,
// buttons: ['copy', 'excel', 'pdf', 'colvis']
// });
// table.buttons().container()
// .appendTo('#example_wrapper .col-sm-6:eq(0)');

// });
