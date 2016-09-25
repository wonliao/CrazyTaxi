<?php require_once('./link.php');?>
<?php

mysql_select_db($news, $link);

mysql_query("SET NAMES 'utf8'");
mysql_query("SET CHARACTER_SET_CLIENT='utf8'");
mysql_query("SET CHARACTER_SET_RESULTS='utf8'");

$action = $_REQUEST['action'];
$event_name = $_REQUEST['event_name'];


$response = array();
$response['data'] = array();




if($action == "get") {

	$cmd = "SELECT * FROM `$event_name` ORDER BY `index` ASC";
	$result = mysql_query($cmd);

	while($data = mysql_fetch_array($result, MYSQL_ASSOC)){
		
		$temp = array();
		foreach($data as $key => $value){
			array_push($temp, $value);
		}
		array_push($response['data'], $temp);
	}
// 儲存全部
} else if($action == "save") {

	$data = json_decode($_REQUEST['data'], true);
	
	foreach($data as $row) {
		
		$index = $row[0];
		$serial_number = $row[1];
		$receive_player = $row[2];
		$receive_time = $row[3];

		// 新增
		if($index == NULL && $serial_number != NULL) {
			
			$cmd = "INSERT INTO `$event_name` (`index`, `serial_number`, `receive_player`, `receive_time`) VALUES
										 (NULL, '$serial_number', '$receive_player', '$receive_time');";
			mysql_query($cmd);
		// 刪除
		} else if($serial_number == "") {
			
			$cmd = "DELETE FROM `$event_name` WHERE `index` = '$index';";
			mysql_query($cmd);
		// 修改
		} else {
			
			$cmd = "UPDATE `$event_name` SET `serial_number` = '$serial_number', `receive_player` = '$receive_player', `receive_time` = '$receive_time' WHERE `index` = '$index';";
			echo "cmd($cmd)";
			mysql_query($cmd);
		}
	}
	
	array_push($response['data'], "OK");
}

echo json_encode($response);
?>