
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
var players = firebase.database().ref('players');

var keys = [];





// 建立測試資料
//setTestData();



function showAllPlayer() {
	
	players.orderByChild('priority').once("value", function(snapshot) {
  		
		//console.log("count("+count+")");
		snapshot.forEach(function(data) {

			keys.push(data.val().priority);
			//console.log("key("+data.key+")("+data.val().priority+")");	
		});

		setPaginate();
	});
	
	setEvent();
}

function showPlayer(key) {

	//console.log("player_id("+key+")");
	var count = 0;
	
	// 先尋找 key
	players.child(key).orderByChild('priority').on("value", function(snapshot) {

		if(snapshot.exists() == true) {

			getData(snapshot);
			count++;
			$("#total_div").html("共"+count+"筆");
		}
	});

	// 再尋找使用者名稱
	players.orderByChild("name").equalTo(key).on("value", function(data) {
		
		data.forEach(function(snapshot) {
			
			//console.log("won test 0 ==> key("+snapshot.key+") name("+snapshot.val().name+")");
			if(snapshot.exists() == true) {
				//console.log("won test 1 ==> enable("+snapshot.val().enable+") name("+snapshot.val().name+")");
				getData(snapshot);
				count++;
				$("#total_div").html("共"+count+"筆");
			}
		});
	});

  	setEvent();
}

function getData(snapshot) {
	
	var enable = snapshot.val().enable;
	var name = snapshot.val().name;
	//console.log("enable("+enable+") name("+name+")");
	
	var enable_str = "";
	if(enable == false)	enable_str = "<span style='width:60px; display:inline-block;'>(封鎖)</span>";
	else					enable_str = "<span style='width:60px; display:inline-block;'></span>";
	
	var key_str = "";
	key_str = "<span style='width:150px; display:inline-block;'><a href='https://www.facebook.com/"+snapshot.key+"' target='_blank'>"+snapshot.key+"</a></span>";
	
	var name_str = "";
	name_str = "<span style='width:200px; display:inline-block;'>"+snapshot.val().name+"</span>";
	
	var speaker_str = "";
	if(enable == false)	speaker_str = "<i class='glyphicon glyphicon-volume-off pull-right'></i>";
	else					speaker_str = "<i class='glyphicon glyphicon-volume-up pull-right'></i>"; 
	
	$('ul#players').append('<li class="list-group-item" data-id="' + snapshot.key + '">' + enable_str + key_str + name_str + speaker_str + '</li>');
}

function setEvent() {

	players.on('child_removed', function(snapshot) {
		//console.log("child_removed");
		$('ul#players').find('li[data-id="' + snapshot.key + '"]').remove();
	});
	
	$('ul.list-group').on('click', 'i', function(e){
		
		e.stopPropagation();
		var key = $(this).parent().attr('data-id');
		//console.log("key("+key+")");

		players.child(key).once("value", function(snapshot) {
			
			//console.log("click ==> snapshot.key("+snapshot.key+")");
			$('ul#players').empty();
			
			// 標題
			var enable_str = "<span style='width:60px; display:inline-block;'></span>";
			var key_str = "<span style='width:150px; display:inline-block;'>Facebook ID</span>"
			var name_str = "<span style='width:200px; display:inline-block;'>使用者名稱</span>"
			var speaker_str = "<i class='pull-right'>封鎖帳號</i>";
			$('ul#players').append('<li class="list-group-item">' + enable_str + key_str + name_str + speaker_str + '</li>');

			
			var fb_player = {name: ""};
			fb_player.name = snapshot.val().name;
			fb_player.enable = !snapshot.val().enable;
			fb_player.priority = snapshot.val().priority;
			var player_updates = {};
			player_updates['/players/' + snapshot.key] = fb_player;
			firebase.database().ref().update(player_updates);
		});
	});
}

function setPaginate() {
	
	var display = 10;			// 最多顯示多少頁
	var one_page_item = 10;	// 一頁顯示多少記錄

	$("#total_div").html("共"+keys.length+"筆");

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

									$('ul#players').empty();
									
									// 標題
									var enable_str = "<span style='width:60px; display:inline-block;'></span>";
									var key_str = "<span style='width:150px; display:inline-block;'>Facebook ID</span>"
									var name_str = "<span style='width:200px; display:inline-block;'>使用者名稱</span>"
									var speaker_str = "<i class='pull-right'>封鎖帳號</i>";
									$('ul#players').append('<li class="list-group-item">' + enable_str + key_str + name_str + speaker_str + '</li>');

									var index = (Math.floor(page) -1) * one_page_item;
									var key = keys[index];
									//console.log("page("+page+") index("+index+") key("+key+")");
								  	
									players.orderByChild('priority').startAt(key).limitToFirst(one_page_item).on("value", function(data) {

										data.forEach(function(snapshot) {
											
											getData(snapshot);
										});
									});
								}
	}).find('li').first().click();
}
