$(function(){

    isFirstTime = true;

    var options = {
	  enableHighAccuracy: true,     // 高精度定位
	  timeout: 10000,               // 10秒 timeout
	  maximumAge: 3 * 60 * 1000     // 暫存3分鐘
	};
	
	function success(pos) {
	  
        var crd = pos.coords;

	    console.log('Your current position is:');
	    console.log('Latitude : ' + crd.latitude);
	    console.log('Longitude: ' + crd.longitude);
	    console.log('More or less ' + crd.accuracy + ' meters.');

	    init(pos);
        HoldOn.close();
	};
	
	function error(err) {
	    console.warn('ERROR(' + err.code + '): ' + err.message);
        ons.createAlertDialog('alert-dialog.html').then(function(alertDialog) {
            alertDialog.show();
        });          
	};

	navigator.geolocation.getCurrentPosition(success, error, options);
});
	

function init(position) {
    
	var infowindow = new google.maps.InfoWindow({
		content: ""
	});

	// Init map
	var map = new google.maps.Map($('#map').get(0), {
		center: {lat: position.coords.latitude, lng: position.coords.longitude},
		zoom: 19,
		mapTypeControl: false,
		streetViewControl: false,
	});

    /*
	var marker = new google.maps.Marker({
		position: {lat: position.coords.latitude, lng: position.coords.longitude},
		map: map
	});
    */

	var markers = {};
	map.addListener('bounds_changed', function(){

		var bounds = map.getBounds();
		var center = map.getCenter();
		//console.log("lat("+center.lat()+") lng("+center.lng()+")");
        window.localStorage.setItem("center", center.lat()+","+center.lng());

		var corner = bounds.getNorthEast();
		var radius = GeoFire.distance([center.lat(), center.lng()], [corner.lat(), corner.lng()]);

        if(isFirstTime == true) {
    	
            isFirstTime = false;

			geoQuery.on('key_entered', function(key, location, distance) {

				location = new google.maps.LatLng(location[0], location[1]);
				//console.log("lat("+location.lat()+") lng("+location.lng()+")");

				var image;
				var random_1_3 = Math.floor(Math.random() * (3 - 1 + 1)) + 1;
				switch(random_1_3) {
				case 1:	image = "images/marker_green.png";	break;
				case 2:	image = "images/marker_red.png";	break;
				case 3:	image = "images/marker_yellow.png";	break;
				}

				markers[key] = new google.maps.Marker({
					position: location,
					map: map,
					icon: image
				});

				markers[key].addListener('click', function() {

					areas.child(key).on('value', function(snapshot) {

						//console.log(snapshot.val());
						var destination = snapshot.val().destination;	// 目的地
						var timestamp = snapshot.val().appointment;		// 共乘時間
						var purpose = snapshot.val().purpose;			// 共乘目的
						var d = new Date(timestamp);
						var time_text = d.toLocaleString();

						var text = "";
                        text += "<div>目的地："+destination+"</div>";
						text += "<div>共乘時間："+time_text+"</div>";
						text += "<div>共乘目的："+purpose+"</div>";

                        window.localStorage.setItem("info_key", key);

						infowindow.setContent("<div onClick='openInfo()' style='width:200px;min-height:40px'>"+text+"</div>");
						infowindow.open(map, markers[key]);

						//map.setZoom(19);
						map.panTo(location);

                        ga('send', 'event', '首頁', 'click', "圖標");
					});
				});
			});

			//remove marker, un-highlight
			geoQuery.on('key_exited', function(key, location, distance) {

				markers[key].setMap(null);
				delete markers[key];
			});
		}

        if(isFirstTime == false) {

			geoQuery.updateCriteria({
				center: [ center.lat(), center.lng() ],
				radius: radius,
		    });
        }
	});
}

function openInfo() {

    ga('send', 'event', '首頁', 'click', "共乘泡泡");
    homeNavigator.pushPage("page1_info.html", {animation: 'slide'});
}
