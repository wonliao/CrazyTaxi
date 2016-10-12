
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

// 建立測試資料
//setTestData();

function showAllPublished() {

	areas.orderByChild('priority').once("value", function(snapshot) {
  		
		//console.log("count("+count+")");
		snapshot.forEach(function(data) {
			
			keys.push(data.val().priority);
			//console.log("key("+data.key+")");	
		});

		setPaginate();
	});
	
	setEvent();
}

function showPublished(key) {
	
	//console.log("player_id("+key+")");

	var count = 0;

	// 先尋找 key
	areas.child(key).orderByChild('priority').on("value", function(snapshot) {
	
		if(snapshot.exists() == true) {

			getData(snapshot);
			count++;
			$("#total_div").html("共"+count+"筆");
		}
	});
  
	// 再尋找使用者名稱
	areas.orderByChild("fb_name").equalTo(key).on("value", function(data) {
		
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
	
	// 再尋找使用者名稱
	areas.orderByChild("state").equalTo(key).on("value", function(data) {
		
		data.forEach(function(snapshot) {
			
			//console.log("won test 0 ==> key("+snapshot.key+") name("+snapshot.val().name+")");
			if(snapshot.exists() == true) {
				//console.log("won test 1 ==> enable("+snapshot.val().enable+") name("+snapshot.val().name+")");
				getData(snapshot);
			}
		});
	});

  	setEvent();
}

function getData(snapshot) {
	
	var d = new Date(snapshot.val().appointment);
	var timestamp_text = d.toLocaleString();
	
	var status = "";
	if(snapshot.val().status == "done") {
		status = "找到共乘";
	} else if(snapshot.val().status == "cancel") {
		status = "取消";
	}
				
	var str = "";
	str += '<li class="list-group-item" data-id="' + snapshot.key + '">';
	str += 		'<a data-id="' + snapshot.val().fb_id + '" href="#" target="_self"><span style="width:150px; display:inline-block;">' + snapshot.val().fb_name + '</span></a>';
	str += 		'<span style="width:200px; display:inline-block;">' + timestamp_text + '</span>';
	str += 		'<span style="width:100px; display:inline-block;">' + snapshot.val().purpose + '</span>';
	str += 		'<span style="width:300px; display:inline-block;">' + snapshot.val().destination + '</span>';
	str += 		'<span style="width:100px; display:inline-block;" id="sataus_'+snapshot.key+'">' + status + '</span>';
	str += 		'<button data-id="' + snapshot.key + '">詳細</button>';
	str += 		'<i class="glyphicon glyphicon-remove pull-right"></i>';
	str += '</li>'
	
	$('ul#areas').append(str);
}

function setEvent() {

	areas.on('child_removed', function(snapshot) {
		$('ul#areas').find('li[data-id="' + snapshot.key + '"]').remove();
	});	

	// 刪除
	$('ul.list-group').on('click', 'i', function(e){
		
		e.stopPropagation();
		var area_id = $(this).parent().attr('data-id');
		console.log("area_id("+area_id+")");
		
		swal({ 
				title: "取消刊登",   
				text: "取消刊登後，會一併取消地圖上的標記。",   
				type: "warning",   
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "是的",   
				cancelButtonText: "不要",   
				closeOnConfirm: false,   
				closeOnCancel: false 
			}, 
			function(isConfirm){   
				if (isConfirm) {
					   
					console.log("area_id2("+area_id+")");
					areas.child(area_id).once("value", function(snapshot) {

						var area = {};
						area.address = snapshot.val().address;
						area.appointment = snapshot.val().appointment;
						area.city = snapshot.val().city;
						area.country = snapshot.val().country;
						area.destination = snapshot.val().destination;
						area.expired_time = snapshot.val().expired_time;
						area.fb_id = snapshot.val().fb_id;
						area.fb_name = snapshot.val().fb_name;
						area.input_address = snapshot.val().input_address;
						area.latitude = snapshot.val().latitude;
						area.longitude = snapshot.val().longitude;
						area.name = snapshot.val().name;
						area.note = snapshot.val().note;
						area.phones = snapshot.val().phones;
						area.postal_code = snapshot.val().postal_code;
						area.priority = snapshot.val().priority;
						area.purpose = snapshot.val().purpose;
						area.state = snapshot.val().state;
						area.timestamp = snapshot.val().timestamp;
						area.status = "cancel";
		
						var area_updates = {};
						area_updates['/areas/' + snapshot.key] = area;
						firebase.database().ref().update(area_updates);
						
						$("#sataus_"+snapshot.key).text("取消");
					});
						
					firebaseRef.child(area_id).remove();
					
					swal("取消刊登成功!", "地圖上的標記也一併取消了。", "success"); 
				} else {     
					swal("關閉", "", "error");   
				} 
			}
		);
	});
	
	// 連結 使用者
	$('ul.list-group').on('click', 'a', function(e){

		e.stopPropagation();
		var area_id = $(this).attr('data-id');
		//console.log("area_id("+area_id+")");
		
		location.href = "player.php?s=" + area_id;
	});
	
	// 打開 info
	$('ul.list-group').on('click', 'button', function(e){

		e.stopPropagation();
		var area_id = $(this).parent().attr('data-id');
		//console.log("area_id("+area_id+")");
		
		ons.createAlertDialog('alert-dialog.html').then(function(alertDialog) {
			
			
			areas.child(area_id).once("value", function(snapshot) {
				
				var fb_image = "https://graph.facebook.com/"+snapshot.val().fb_id+"/picture?type=normal";
				var d = new Date(snapshot.val().appointment);
				var timestamp_text = d.toLocaleString();
			
				var text = "";
				text += '<section style="padding: 4px 16px; text-align:center;">';
				text += '	<img id="fb_user_picture" src="'+fb_image+'"/>';
				text += '	<div>'+snapshot.val().fb_name+'</div>';
				text += '</section>';
				
				text += '<div style="clear:both; height:10px"></div>';
				
				text += '<section class="section1">';
				text += '	<div style="color:#b5b2b2;">手機號碼</div>';
				text += '	<div style="color:#6b6b6b;">'+snapshot.val().phones+'</div>';
				text += '</section>';
				 
				text += '<section class="section1">';
				text += '	<div style="color:#b5b2b2;">上車地點</div>';
				text += '	<div style="color:#6b6b6b;">'+snapshot.val().input_address+'</div>';
				text += '</section>';
				
				text += '<section class="section1">';
				text += '	<div style="color:#b5b2b2;">下車地點</div>';
				text += '	<div style="color:#6b6b6b;">'+snapshot.val().destination+'</div>';
				text += '</section>';
				
				text += '<section class="section1">';
				text += '	<div style="color:#b5b2b2;">出發時間</div>';
				text += '	<div style="color:#6b6b6b;">'+timestamp_text+'</div>';
				text += '</section>';
				
				text += '<section class="section1">';
				text += '	<div style="color:#b5b2b2;">共乘目的</div>';
				text += '	<div style="color:#6b6b6b;">'+snapshot.val().purpose+'</div>';
				text += '</section>';
				
				text += '<section class="section1">';
				text += '	<div style="color:#b5b2b2;">備註</div>';
				text += '	<div style="color:#6b6b6b;">'+snapshot.val().note+'</div>';
				text += '</section>';
				
				//console.log("text("+text+")");

				$(".alert-dialog-content").empty().html(text);
			
				alertDialog.show();
			});
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
								  	
									$('ul#areas').empty();
									
									// 標題
									var str = "";
									str += '<li class="list-group-item">';
									str += 		'<span style="width:150px; display:inline-block;">使用者名稱</span>';
									str += 		'<span style="width:200px; display:inline-block;">出發時間</span>';
									str += 		'<span style="width:300px; display:inline-block;">共乘目的</span>';
									str += 		'<span style="width:100px; display:inline-block;">目的地</span>';
									str += 		'<span style="width:100px; display:inline-block;">狀態</span>';
									str += 		'<span style="display:inline-block;">查看詳細資料</span>';
									str += 		'<i class="pull-right">取消刊登記錄</i>';
									str += '</li>'
									
									$('ul#areas').append(str);
									
									var index = (Math.floor(page) -1) * one_page_item;
									var key = keys[index];
									console.log("page("+page+") index("+index+") key("+key+")");
								  	
									areas.orderByChild('priority').startAt(key).limitToFirst(one_page_item).once("value", function(data) {
									
										data.forEach(function(snapshot) {
											
											getData(snapshot);
									  	});
									});
								}
	}).find('li').first().click();
}