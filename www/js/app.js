ons.bootstrap();

        
$(function(){

    HoldOn.open({message:"定位中，請稍候"});
});

// Initialize the Firebase SDK
firebase.initializeApp({
    apiKey: 'AIzaSyBj3JAk_l5OFAWZhj-UZn2fXLbVy5Lx3Yc',
	databaseURL: 'https://go2gether-e78d4.firebaseio.com/'
});

// Create a new GeoFire instance
firebaseRef = firebase.database().ref('makers');
geoFire = new GeoFire(firebaseRef);

geoQuery = geoFire.query({
    			center: [ 0, 0 ],
				radius: 1.0
			});

isFirstTime = true;

// Select areas that are in the database
var areas = firebase.database().ref('areas');
var players = firebase.database().ref('players');

// This is called with the results from from FB.getLoginStatus().
function statusChangeCallback(response) {
    
    $('#menu_fb_user_picture').attr("src", "").hide();
    $('#menu_fb_user_name').text("");
    
    //console.log('statusChangeCallback');
    //console.log(response);
    if (response.status === 'connected') {

        // Logged into your app and Facebook.
        //console.log("Your UID is " + response.authResponse.userID);
        testAPI();
    } else if (response.status === 'not_authorized') {
        
        // The person is logged into Facebook, but not your app.
        console.log("not_authorized");
        window.localStorage.clear();
    } else {

        console.log("unknow");
        /*
        window.localStorage.setItem("facebook_id", "");
        window.localStorage.setItem("facebook_name", "");
        window.localStorage.setItem("facebook_email", "");
        window.localStorage.setItem("old_facebook_id", "");
        window.localStorage.setItem("amart", "");
        */
        window.localStorage.clear();
    }
}

// This function is called when someone finishes with the Login
// Button.  See the onlogin handler attached to it in the sample
// code below.
function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
}

window.fbAsyncInit = function() {
    FB.init({
        appId      : '364003187320606',
        cookie     : true,  // enable cookies to allow the server to access 
                            // the session
        xfbml      : true,  // parse social plugins on this page
        version    : 'v2.5' // use graph api version 2.5
    });


    // Now that we've initialized the JavaScript SDK, we call 
    // FB.getLoginStatus().  This function gets the state of the
    // person visiting this page and can return one of three states to
    // the callback you provide.  They can be:
    //
    // 1. Logged into your app ('connected')
    // 2. Logged into Facebook, but not your app ('not_authorized')
    // 3. Not logged into Facebook and can't tell if they are logged into
    //    your app or not.
    //
    // These three cases are handled in the callback function.
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    });
    
};

// Load the SDK asynchronously
(function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) return;
    js = d.createElement(s); js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

// Here we run a very simple test of the Graph API after login is
// successful.  See statusChangeCallback() for when this call is made.
function testAPI() {
    
    FB.api('/me?fields=email,name', function(response) {
        
        var fb_id = response.id;
        var fb_name = response.name;
        //window.localStorage.setItem("facebook_id", fb_id);
        window.localStorage.setItem("facebook_name", fb_name);
        window.localStorage.setItem("facebook_email", response.email);
        console.log("Facebook Successful login ==> id(" + response.id + ") name(" + response.name + ") email("+response.email+")"); 

        window.localStorage.setItem("facebook_id", response.id);
        window.localStorage.setItem("old_facebook_id", response.id);
        
        players.child(fb_id).once("value", function(snapshot) {
            
            console.log("test 1 ==> snapshot.val("+snapshot.val()+")");
            if(snapshot.val() == null) {
    
                console.log("test 2 ==> fb_id("+fb_id+") fb_name("+fb_name+")");

                // fb player 
                var d = new Date();
                var fb_player = {name: ""};
                fb_player.name = fb_name;
                fb_player.enable = true;
                fb_player.priority = 0 - Math.floor( d.getTime() + d.getMilliseconds() );        // 排序用
                var player_updates = {};
                player_updates['/players/' + fb_id] = fb_player;
                firebase.database().ref().update(player_updates);
            }
        });

/*
        var old_fb_id = window.localStorage.getItem("old_facebook_id");
        console.log("old_fb_id("+old_fb_id+") fb_id("+fb_id+")");
        if(old_fb_id == "" || old_fb_id == null) {

            var url = "backend/get_fb_user_id.php?user_id="+fb_id;
            console.log("url("+url+")");
            $.getJSON(url, {}, function(data) {

                var new_fb_id = data.data.id;
                window.localStorage.setItem("facebook_id", new_fb_id);
                window.localStorage.setItem("old_facebook_id", new_fb_id);
                console.log("get new facebook id ==> new_fb_id("+new_fb_id+")");
                
                
                players.child(new_fb_id).once("value", function(snapshot) {
                    if(snapshot.val() == null) {
    
                        console.log("test 2 ==> fb_name("+fb_name+")");
                        // fb player 
                        var d = new Date();
                        var fb_player = {name: ""};
                        fb_player.name = fb_name;
                        fb_player.enable = true;
                        fb_player.priority = 0 - Math.floor( d.getTime() + d.getMilliseconds() );        // 排序用
                        var player_updates = {};
                        player_updates['/players/' + new_fb_id] = fb_player;
                        firebase.database().ref().update(player_updates);
                    }
                });
            });

        } else {

            var old_fb_id = window.localStorage.getItem("old_facebook_id");
            window.localStorage.setItem("facebook_id", old_fb_id);
            //console.log("facebook_id("+old_fb_id+")");
        }
*/
        var fb_image = "https://graph.facebook.com/"+response.id+"/picture?type=normal";
        $('#menu_fb_user_picture').attr("src", fb_image).show();
        $('#menu_fb_user_name').text(response.name);
    });
}

function getTimeStr(dt) {

    var d = dt.toLocaleDateString();
    var t = dt.toLocaleTimeString();

    t = t.replace(/\u200E/g, '');
    t = t.replace(/^([^\d]*\d{1,2}:\d{1,2}):\d{1,2}([^\d]*)$/, '$1$2');
    var result = d + ' ' + t;
    return result;
}

function reload() {
    location.reload();
}
