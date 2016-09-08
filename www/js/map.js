$(function(){
	
	var options = {
	  enableHighAccuracy: true,
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
	
	// Initialize the Firebase SDK
	firebase.initializeApp({
		apiKey: 'AIzaSyAShxz9Efm5a4CEFA_DitWOQxci_8BQcLs',
		databaseURL: 'https://test-b2a2d.firebaseio.com/'
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

	var icon = {
		path: 'M20.5,0.5 c11.046,0,20,8.656,20,19.333c0,10.677-12.059,21.939-20,38.667c-5.619-14.433-20-27.989-20-38.667C0.5,9.156,9.454,0.5,20.5,0.5z',
		fillColor: '#0093d7',
		fillOpacity: 1,
		anchor: new google.maps.Point(40,50),
		strokeWeight: 1.4,
		strokeColor: '#00437c',
		scale: .6
	}

	var iconInactive = {
		path: 'M20.5,0.5 c11.046,0,20,8.656,20,19.333c0,10.677-12.059,21.939-20,38.667c-5.619-14.433-20-27.989-20-38.667C0.5,9.156,9.454,0.5,20.5,0.5z',
		fillColor: '#ffffff',
		fillOpacity: 1,
		anchor: new google.maps.Point(40,50),
		strokeWeight: 1.4,
		strokeColor: '#0093d7',
		strokeOpacity: 1,
		scale: .6
	}

	//dynamically update geoQuery, add or remove markers
	map.addListener('bounds_changed', function(){
		var bounds = map.getBounds();
		var center = map.getCenter();
		//console.log("lat("+center.lat()+") lng("+center.lng()+")");
		
		
		var corner = bounds.getNorthEast();
		var radius = GeoFire.distance([center.lat(), center.lng()], [corner.lat(), corner.lng()]);

		if (typeof geoQuery !== 'undefined') {
			//console.log('Updating center to ' + center + ', radius to ' + radius + 'km');

			geoQuery.updateCriteria({
				center: [ center.lat(), center.lng() ],
				radius: radius,
			});

		} else {
			console.log('Creating new GeoFire query with center at ' + center + ', radius of ' + radius + 'km');

			geoQuery = geoFire.query({
				center: [ center.lat(), center.lng() ],
				radius: radius,
			});
			
			//create new marker, highlight in sidebar
			geoQuery.on('key_entered', function(key, location, distance) {
				$ul.find('li[data-id="' + key + '"]').addClass('list-group-item-info');

				location = new google.maps.LatLng(location[0], location[1]);
	
				console.log("lat("+location.lat()+") lng("+location.lng()+")");
	
				
				markers[key] = new google.maps.Marker({
					position: location,
					map: map,
					icon: iconInactive,
				});
				
				markers[key].addListener('click', function(){
					map.setZoom(15);
					map.panTo(location);
				});
				
				//console.log(key + ' is located at [' + location + '] which is within the query (' + distance.toFixed(2) + ' km from center)');
			});

			//remove marker, un-highlight
			geoQuery.on('key_exited', function(key, location, distance) {
				$ul.find('li[data-id="' + key + '"]').removeClass('list-group-item-info');
				
				markers[key].setMap(null);
				delete markers[key];
				//console.log(key + ' is located at [' + location + '] which is no longer within the query (' + distance.toFixed(2) + ' km from center)');
			});
		}
	});
	
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

	$('#add').on('submit', function() {
				
		$.getJSON('https://maps.googleapis.com/maps/api/geocode/json', {
			key: 'AIzaSyAHgoUk-vzZfk0CPhkOBNsX5fTyrCKVkh8',
			address: $('input#address').val()
		}, function(data) {
			
			//parse address
			var c, point_of_interest, area = {
				name: $('input#name').val(),
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