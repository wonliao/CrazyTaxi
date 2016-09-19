<?php
$search = $_GET["s"];
?>
<!DOCTYPE HTML>
<html>
<head>
<title>Locations</title>
<link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" rel="stylesheet">
<link href="css/main.css" rel="stylesheet">
<link rel="stylesheet" type="text/css" href="css/style.css" media="screen"/>
<link rel="stylesheet" type="text/css" href="css/search.css" media="screen"/>


<script src="https://code.jquery.com/jquery-2.2.1.min.js"></script>
<script src="https://www.gstatic.com/firebasejs/live/3.0/firebase.js"></script>
<script src="https://cdn.firebase.com/libs/geofire/4.1.0/geofire.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
<script src="js/published.js" charset="UTF-8" ></script>
<script src="js/jquery.paginate.js" type="text/javascript"></script>
<script src="js/jquery.color.js"></script>
<script src="js/search.js"></script>


<link rel='stylesheet prefetch' href='https://cdn.rawgit.com/OnsenUI/OnsenUI/2.0.0-alpha.15/build/css/onsenui.css'>
<link rel='stylesheet prefetch' href='https://cdn.rawgit.com/OnsenUI/OnsenUI/2.0.0-alpha.15/build/css/onsen-css-components.css'>

<script src="../lib/angular/angular.js"></script>
<script src="../lib/onsen/js/onsenui.js"></script>

<style>
.checkbox-grid li {
	display: block;
	float: left;
	width: 33%;
}
.pagedemo{
	border: 1px solid #CCC;
	width:310px;
	margin:2px;
	padding:50px 10px;
	text-align:center;
	background-color:white;
}
#fb_user_picture {
    -webkit-border-radius: 60px;
    -moz-border-radius: 60px;
    border-radius: 60px;
    BORDER: #c9c9c9 2px solid;
}
.section1 {
    text-align:left;
}
</style>
</head>

<body>

    <div id="paginationdemo" class="demo">
        <h1>刊登記錄</h1>
        
        <form id="searchForm">
            <fieldset>
                <div class="input">
                	<input type="text" name="s" id="s" value="請輸入使用者名稱" />
                </div>
                <input type="submit" id="searchSubmit" value="" />
            </fieldset>
        </form>
        
        
        <div id="pagination_div"></div>
        
        <ul id="areas" class="list-group"></ul>
    </div>
    
    <ons-template id="alert-dialog.html">
        <ons-alert-dialog var="alertDialog">
            <div class="alert-dialog-title"><strong>刊登資訊</strong></div>
            <div class="alert-dialog-content"></div>
            <div class="alert-dialog-footer">
                <button class="alert-dialog-button" onClick="alertDialog.hide()">關閉</button>
            </div>
        </ons-alert-dialog>
    </ons-template>

	<script type="text/javascript">

	ons.bootstrap();

	$(document).ready(function(e) {
		
		if("<?=$search?>" != "") {

			showPublished("<?=$search?>");
		} else {

			showAllPublished();
		}
	});
	</script>
</body>
</html>
