$(function(){
    console.log('test1');
	var options = {
	  enableHighAccuracy: false,
	  timeout: 5000,
	  maximumAge: 0
	};
	
	function success(pos) {
	  var crd = pos.coords;
	
	  console.log('Your current position is:');
	  console.log('Latitude : ' + crd.latitude);
	  console.log('Longitude: ' + crd.longitude);
	  console.log('More or less ' + crd.accuracy + ' meters.');
	  
	  init(pos);
	};
	
	function error(err) {
	  console.warn('ERROR(' + err.code + '): ' + err.message);
	};
	
	navigator.geolocation.getCurrentPosition(success, error, options);
});
	

function init(position) {
    console.log('test2');
    
	var infowindow = new google.maps.InfoWindow({
		content: "test"
	});

/*
    // Initialize the Firebase SDK
    firebase.initializeApp({
    	apiKey: 'AIzaSyBj3JAk_l5OFAWZhj-UZn2fXLbVy5Lx3Yc',
    	databaseURL: 'https://go2gether-e78d4.firebaseio.com/'
    });
    

	// Create a new GeoFire instance
	var firebaseRef = firebase.database().ref('makers');
	var geoFire = new GeoFire(firebaseRef);
	var geoQuery;
	
    
	// Select areas that are in the database
	var areas = firebase.database().ref('areas');
	$ul = $('ul#areas');
	areas.on('child_added', function(snapshot) {
		$ul.append('<li class="list-group-item" data-id="' + snapshot.key + '" data-latitude="' + snapshot.val().latitude + '" data-longitude="' + snapshot.val().longitude + '">' + snapshot.val().name + ' (' + snapshot.val().city + ', ' + snapshot.val().state + ')<i class="glyphicon glyphicon-remove pull-right"></i></li>');
	});	
	areas.on('child_removed', function(snapshot) {
		$ul.find('li[data-id="' + snapshot.key + '"]').remove();
	});	
*/

	// Init map
	var map = new google.maps.Map($('#map').get(0), {
		center: {lat: position.coords.latitude, lng: position.coords.longitude},
		zoom: 19,
		mapTypeControl: false,
		streetViewControl: false,
	});

	var marker = new google.maps.Marker({
		position: {lat: position.coords.latitude, lng: position.coords.longitude},
		map: map
		//title: "You're here"
	});

	var markers = {};

    
	//dynamically update geoQuery, add or remove markers
	map.addListener('bounds_changed', function(){
        
        console.log('bounds_changed');
        
		var bounds = map.getBounds();
		var center = map.getCenter();
		//console.log("lat("+center.lat()+") lng("+center.lng()+")");
		
		var corner = bounds.getNorthEast();
		var radius = GeoFire.distance([center.lat(), center.lng()], [corner.lat(), corner.lng()]);


		if(isFirstTime == true) {
            isFirstTime = false;
			console.log('Creating new GeoFire query with center at ' + center + ', radius of ' + radius + 'km');
/*
			geoQuery = geoFire.query({
				center: [ center.lat(), center.lng() ],
				radius: radius,
			});
*/
    
			//create new marker, highlight in sidebar
			geoQuery.on('key_entered', function(key, location, distance) {
				//$ul.find('li[data-id="' + key + '"]').addClass('list-group-item-info');

				location = new google.maps.LatLng(location[0], location[1]);
	
				console.log("lat("+location.lat()+") lng("+location.lng()+")");
	
				
				var image;
				var random_1_3 = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				switch(random_1_3) {
				case 1:	image = "images/marker_green.png";	break;
				case 2:	image = "images/marker_red.png";		break;
				case 3:	image = "images/marker_yellow.png";	break;
				}
				
				markers[key] = new google.maps.Marker({
					position: location,
					map: map,
					icon: image //iconInactive,
				});
				
				/*
				markers[key].addListener("dblclick", function() { 
               	console.log("Double Click"); 
            	});
				*/
				
				markers[key].addListener('click', function() {
					
					console.log("key("+key+")");
	
					areas.child(key).on('value', function(snapshot) {
						
						console.log(snapshot.val());
						var destination = snapshot.val().destination;	// 目的地
						var timestamp = snapshot.val().timestamp;		// 共乘時間
						var purpose = snapshot.val().purpose;			// 共乘目的
						
						var d = new Date(timestamp);
						var time_text = d.toLocaleString();
						
						var text = "<div>目的地："+destination+"</div>";
						text += "<div>共乘時間："+time_text+"</div>";
						text += "<div>共乘目的："+purpose+"</div>";
						
						
						infowindow.setContent("<div onClick='openInfo()' style='width:200px;min-height:40px'>"+text+"</div>");
						infowindow.open(map, markers[key]);
						
						
						
						map.setZoom(19);
						map.panTo(location);
					});

								
				});
				
				
				
				
				//console.log(key + ' is located at [' + location + '] which is within the query (' + distance.toFixed(2) + ' km from center)');
			});

			//remove marker, un-highlight
			geoQuery.on('key_exited', function(key, location, distance) {
				//$ul.find('li[data-id="' + key + '"]').removeClass('list-group-item-info');
				
				markers[key].setMap(null);
				delete markers[key];
				//console.log(key + ' is located at [' + location + '] which is no longer within the query (' + distance.toFixed(2) + ' km from center)');
			});
		}
        
        if(isFirstTime == false) {
         	
            console.log('Updating center to ' + center + ', radius to ' + radius + 'km');

			geoQuery.updateCriteria({
				center: [ center.lat(), center.lng() ],
				radius: radius,
		    });
        }
	});
	
    /*
	$('ul.list-group').on('click', 'li', function(){
		//var lat = $(this).attr('data-latitude');
		//var lng = $(this).attr('data-longitude');
		//console.log("lat("+lat+") lng("+lng+")");
		
		map.panTo(new google.maps.LatLng($(this).attr('data-latitude'), $(this).attr('data-longitude')));
		map.setCenter(new google.maps.LatLng($(this).attr('data-latitude'), $(this).attr('data-longitude')));
		map.setZoom(15);
	});

	$('ul.list-group').on('click', 'i', function(e){
		e.stopPropagation();
		var area_id = $(this).parent().attr('data-id');
		areas.child(area_id).remove();
		geoFire.remove(area_id);
	});
    */

	$('#add').on('submit', function() {
		
		var address = $('input#address').val();				// 上車地點
		var destination = $('input#destination').val();		// 下車地點
		var startDate = $('input#startDate').val();			// 出發日期
		var startTime = $('input#startTime').val();			// 出發時間
		var phones = $('input#phones').val();					// 手機號碼
		var note = $('input#note').val();						// 備註
		var purpose = $('input[name=purpose]:checked').val();		// 共乘目的
		
		console.log("address("+address+")");
		console.log("destination("+destination+")");
		console.log("startDate("+startDate+")");
		console.log("startTime("+startTime+")");
		console.log("phones("+phones+")");
		console.log("note("+note+")");
		console.log("purpose("+purpose+")");
		
				
		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
			key: 'AIzaSyAHgoUk-vzZfk0CPhkOBNsX5fTyrCKVkh8',
			address: address	// 上車地點
		}, function(data) {
			
			//parse address
			var c, point_of_interest, area = {
				name: destination,		// 下車地點
				latitude: data.results[0].geometry.location.lat,
				longitude: data.results[0].geometry.location.lng,
			};

			//get address, city and state
			for (var i = 0; i < data.results[0].address_components.length; i++) {
				c = data.results[0].address_components[i];
				if (!c.types.length || c.types[0] == 'point_of_interest') {
					//record the point of interest in case address is empty
					point_of_interest = c.short_name;
				} else if (c.types.indexOf('street_number') !== -1) {
					//set address as street number
					area.address = c.long_name;
				} else if (c.types.indexOf('route') !== -1) {
					//append street name
					area.address += ' ' + c.long_name;
					area.address = area.address.trim();
				} else if (c.types.indexOf('locality') !== -1) {
					area.city = c.long_name;
				} else if (c.types.indexOf('sublocality') !== -1) {
					if (!area.city) area.city = c.long_name;
				} else if (c.types.indexOf('administrative_area_level_3') !== -1) {
					if (!area.city) area.city = c.long_name;
				} else if (c.types.indexOf('administrative_area_level_1') !== -1) {
					area.state = c.short_name;
				} else if (c.types.indexOf('postal_code') !== -1) {
					area.postal_code = c.short_name;
				} else if (c.types.indexOf('country') !== -1) {
					area.country = c.short_name;
				}
			}
			
			// facebook user id
			area.fb_id = "12345678";
			
			

			area.address = address;			// 上車地點
			area.destination = destination;	// 下車地點
			area.phones = phones;				// 手機號碼
			area.note = note;					// 備註
			area.purpose = purpose;			// 共乘目的
			
			// 建立時間
			var d = new Date();
			area.timestamp = d.getTime();
			
			// 預約時間
			d.setHours(d.getHours() + 1);
			area.Appointment = d.getTime();
			
			// 過期時間 = 預約時間 + 10秒
			d.setMinutes(d.getMinutes() + 10);
			area.expired_time = d.getTime();
			
			
			if (!area.address && point_of_interest) area.address = point_of_interest;
			
			//persist to firebase
			var area_id = firebase.database().ref().child('areas').push().key;
			var updates = {};
			updates['/areas/' + area_id] = area;
			firebase.database().ref().update(updates);

			//geofire
			geoFire.set(area_id, [area.latitude, area.longitude]).then(function() {
				//console.log(area_id + ': setting position to [' + area.latitude + ',' + area.longitude + ']');
			});
			
			//clean up form
			$('form#add').trigger('reset');
		});
		
		return false;
	});	
}

function openInfo() {
	
	console.log("openInfo 1");
 
    ons.ready(function() {
        console.log("openInfo 2");
        setTimeout(function() {
            console.log("openInfo 3");
            
            tabbar.setActiveTab(1);
    
        }, 10);
    });
}
