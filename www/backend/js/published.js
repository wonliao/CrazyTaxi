
// Initialize the Firebase SDK
firebase.initializeApp({
	apiKey: 'AIzaSyBj3JAk_l5OFAWZhj-UZn2fXLbVy5Lx3Yc',
	databaseURL: 'https://go2gether-e78d4.firebaseio.com/'
});

// Create a new GeoFire instance
var firebaseRef = firebase.database().ref('makers');
//geoFire = new GeoFire(firebaseRef);
var geoQuery;

var areas = firebase.database().ref('areas');


var keys = [];

function showAllPublished() {

	areas.orderByChild('priority').once("value", function(snapshot) {
  		
		//var count = snapshot.numChildren();
		//console.log("count("+count+")");
		console.log("won test ");
		snapshot.forEach(function(data) {
			keys.push(data.val().priority);
			//console.log("key("+data.key+")");	
		});

		setPaginate();
	});
	
	setEvent();
}

function showPublished(key) {
	
	console.log("player_id("+key+")");
	
	areas.child(key).orderByChild('priority').on("value", function(snapshot) {
	
		if(snapshot.exists() == true) {

			$('ul#areas').append('<li class="list-group-item" data-id="' + snapshot.key + '" data-latitude="' + snapshot.val().latitude + '" data-longitude="' + snapshot.val().longitude + '">' + snapshot.val().destination + ' (' + snapshot.val().fb_name + ', ' + snapshot.val().purpose + ')<i class="glyphicon glyphicon-remove pull-right"></i></li>');
		}
	});
  
  	setEvent();
}

function setEvent() {

	areas.on('child_removed', function(snapshot) {
		$('ul#areas').find('li[data-id="' + snapshot.key + '"]').remove();
	});	

	$('ul.list-group').on('click', 'i', function(e){
		e.stopPropagation();
		var area_id = $(this).parent().attr('data-id');
		console.log("area_id("+area_id+")");
		areas.child(area_id).remove();
	});
}

function setPaginate() {
	
	var display = 10;			// 最多顯示多少頁
	var one_page_item = 10;	// 一頁顯示多少記錄
	
	// 總頁數
	var count = Math.ceil( keys.length / one_page_item );
	if(count < display)	display = count;
	//console.log("keys.length("+keys.length+") count("+count+") display("+display+")");

	$("#pagination_div").paginate({
		count 		: count,
		start 		: 1,
		display    : display,
		border					: true,
		border_color			: '#fff',
		text_color  			: '#fff',
		background_color    	: 'black',	
		border_hover_color		: '#ccc',
		text_hover_color  		: '#000',
		background_hover_color	: '#fff', 
		images					: false,
		mouse					: 'press',
		onChange     			: function(page){
								  	
									$('ul#areas').empty();
									
									var index = (Math.floor(page) -1) * one_page_item;
									var key = keys[index];
									console.log("page("+page+") index("+index+") key("+key+")");
								  	
									areas.orderByChild('priority').startAt(key).limitToFirst(one_page_item).once("value", function(data) {
									
										data.forEach(function(snapshot) {
											
											//console.log("ke("+snapshot.key+")"+ snapshot.val().address);
											$('ul#areas').append('<li class="list-group-item" data-id="' + snapshot.key + '" data-latitude="' + snapshot.val().latitude + '" data-longitude="' + snapshot.val().longitude + '">' + snapshot.val().destination + ' (' + snapshot.val().fb_name + ', ' + snapshot.val().purpose + ')<i class="glyphicon glyphicon-remove pull-right"></i></li>');
									  	});
									});
								}
	}).find('li').first().click();
}


// 建立測試資料
function setTestData() {

	for(var i=1; i<=50; i++) {
		
		var area = {};
		
		area.fb_id = "100000151115805";

		area.address = "測試地址"+i;			// 上車地點
		area.destination = "測試目的地"+i;		// 下車地點
		area.phones = "0921960028";			// 手機號碼
		area.note = "測試"+i;					// 備註
		area.purpose = "抓寶可夢"+i;		// 共乘目的
			
		// 建立時間
		var d = new Date();
		area.timestamp = d.getTime();
			
		// 預約時間
		d.setHours(d.getHours() + 1);
		area.appointment = d.getTime();
		
		// 過期時間 = 預約時間 + 10分鐘
		d.setMinutes(d.getMinutes() + 10);
		area.expired_time = d.getTime();
	   
		area.city = "三重區";
		area.country = "TW";
		area.fb_mail = "undefined";
		area.fb_name = "廖志旺";
		area.input_address = "241台灣新北市三重區永福街135巷27號";
		area.latitude = 25.0772008;
		area.longitude = 121.4776986;
		area.name = "三重";
		area.postal_code = "241";
		area.state = "新北市";
		
		area.priority = 0 - Math.floor( d.getTime() + d.getMilliseconds() + i );

		//persist to firebase
		var area_id = firebase.database().ref().child('areas').push().key;
		var updates = {};
		updates['/areas/' + area_id] = area;
		firebase.database().ref().update(updates);

		// fb player 
		var fb_player = {name: ""};
		fb_player.name = "測試者"+i;
		fb_player.enable = true;
		var player_updates = {};
		player_updates['/players/' + 1000000000000+i] = fb_player;
		firebase.database().ref().update(player_updates);
	}
}
