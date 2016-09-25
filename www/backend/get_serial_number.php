<?php require_once('./link.php');?>
<?php

mysql_select_db($news, $link);

mysql_query("SET NAMES 'utf8'");
mysql_query("SET CHARACTER_SET_CLIENT='utf8'");
mysql_query("SET CHARACTER_SET_RESULTS='utf8'");

$fb_id = $_REQUEST['fb_id'];
$event_name = $_REQUEST['event_name'];
//echo "fb_id($fb_id)<br />";
//echo "event_name($event_name)<br />";

$response = array();
$response['flag'] = array();
$response['data'] = array();

// 檢查是否已領取
$cmd = "SELECT * FROM `$event_name` WHERE `receive_player` = '$fb_id';";
$result = mysql_query($cmd);
$num_rows = mysql_num_rows($result);
if($num_rows > 0) {
	
	// 已領取
	array_push($response['flag'], 0);
} else {

	// 未領取
	$cmd2 = "SELECT * FROM `$event_name` WHERE `receive_player` = '' ORDER BY `index` ASC LIMIT 1;";
	$result2 = mysql_query($cmd2);
	while($data2 = mysql_fetch_array($result2, MYSQL_ASSOC)){

		$index = $data2['index'];
		$serial_number	 = $data2['serial_number'];
		//echo "index($index) serial_number($serial_number)<br />";

		$cmd3 = "UPDATE `zone` SET `receive_player` = '$fb_id' WHERE `index` = '$index';";
		//echo "cmd3($cmd3)<br />";
		mysql_query($cmd3);

		array_push($response['flag'], 1);
		array_push($response['data'], $serial_number);
	}
}

echo json_encode($response);
?>