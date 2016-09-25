<?php require_once('./link.php');?>
<?php

mysql_select_db($news, $link);

mysql_query("SET NAMES 'utf8'");
mysql_query("SET CHARACTER_SET_CLIENT='utf8'");
mysql_query("SET CHARACTER_SET_RESULTS='utf8'");

$action = $_REQUEST['action'];
$event_name = $_REQUEST['event_name'];

// for test
//$action = "get";
//$event_name = "kkbox";


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
			
			$cmd = "INSERT INTO `kkbox` (`index`, `serial_number`, `receive_player`, `receive_time`) VALUES
										 (NULL, '$serial_number', '$receive_player', '$receive_time');";
			mysql_query($cmd);
		// 刪除
		} else if($serial_number == "") {
			
			$cmd = "DELETE FROM `kkbox` WHERE `kkbox`.`index` = '$index';";
			mysql_query($cmd);
		// 修改
		} else {
			
			$cmd = "UPDATE `kkbox` SET `serial_number` = '$serial_number', `receive_player` = '$receive_player', `receive_time` = '$receive_time' WHERE `index` = '$index';";
			mysql_query($cmd);
		}
	}
	
	array_push($response['data'], "OK");
}

echo json_encode($response);

/*
// 載入
if($action == "get") {
	
	$cmd = "SELECT * FROM `boscogen`.$event_name ORDER BY `id` DESC";
	$result = mysql_query($cmd);
	
	$temp_list = array(); 
	while($data = mysql_fetch_array($result, MYSQL_ASSOC)){
		
		$temp = array();
		foreach($data as $key => $value){
			
			array_push($temp, $value);
			
			if($key == "店名") {

				$city = $data["縣市"];
				$area = $data["鄉鎮市區"];
				$name = $data["店名"];

				$cmd2 = "SELECT `address` FROM `dbindex`.`boscogen_store` WHERE `campaign_id` = '$campaign_id' AND `city` = '$city' AND `area` = '$area' AND `name` = '$name';";
				$result2 = mysql_query($cmd2);
				if(mysql_num_rows($result2) > 0) {

					$data2 = mysql_fetch_array($result2);
					$address = $data2['address'];
				} else {

					$cmd3 = "SELECT `address` FROM `dbindex`.`boscogen_store` WHERE `name` = '$name' ORDER BY `campaign_id` DESC;";
					$result3 = mysql_query($cmd3);
					$data3 = mysql_fetch_array($result3);
					$address = $data3['address'];
				}

				array_push($temp, $address);
			}
		}
		
		array_push($response['data'], $temp);
	}
	

// 跳出問卷
} else if($action == "get_bounce") {
	
	$cmd = "SELECT * FROM `boscogen`.`bounce` WHERE `campaign_id` = '$campaign_id' ORDER BY `index` DESC";
	$result = mysql_query($cmd);
	
	while($data = mysql_fetch_array($result, MYSQL_ASSOC)){
		
		$temp = array();
		foreach($data as $key => $value){
			array_push($temp, $value);
		}
		array_push($response['data'], $temp);
	}

// 店點上傳
} else if($action == "get_store") {
	
	$cmd = "SELECT * FROM `boscogen_store` WHERE `campaign_id` = '$campaign_id' ORDER BY `city` ASC";
	$result = mysql_query($cmd);
	$num = mysql_num_rows($result);
	if($num <= 0) {

		// 複製上一次的店點
		$cmd = "SELECT `campaign_id` FROM `boscogen_store` WHERE `campaign_id` < 2 ORDER BY `campaign_id` DESC";
		$result = mysql_query($cmd);
		$data = mysql_fetch_array($result, MYSQL_ASSOC);
		$last_campaign_id = $data['campaign_id'];

		// 複製
		$cmd = "INSERT INTO `boscogen_store` SELECT NULL, '$campaign_id', a.`name`, a.`city`, a.`area`, a.`address` FROM `boscogen_store` AS a WHERE a.`campaign_id` = '$last_campaign_id'";
		$result = mysql_query($cmd);
		
		// 取出新的
		$cmd = "SELECT * FROM `boscogen_store` WHERE `campaign_id` = '$campaign_id' ORDER BY `city` ASC";
		$result = mysql_query($cmd);	
	}
	
	while($data = mysql_fetch_array($result, MYSQL_ASSOC)){
		
		$temp = array();
		foreach($data as $key => $value){
			array_push($temp, $value);
		}
		array_push($response['data'], $temp);
	}

// 店點更新
} else if($action == "save_store") {


	$id = $_REQUEST['id'];
	$col = $_REQUEST['col'];
	$value = $_REQUEST['value'];
	
	$cmd = "";
	$row_name = "";
	switch($col) {
	//case 0:		$row_name = "id";				break;
	//case 1:		$row_name = "campaign_id";	break;
	case 2: 	$row_name = "name";				break;
	case 3:		$row_name = "city";				break;
	case 4:		$row_name = "area"; 				break;
	case 5:		$row_name = "address"; 			break;
	}
	
	$cmd = "UPDATE `boscogen_store` SET `$row_name` = '$value' WHERE  `id` = '$id';";
	$result = mysql_query($cmd);
	//echo "result($result) cmd($cmd)";
	array_push($response['data'], array($result));

// 移除店點
} else if($action == "remove_store") {
	
	$ids_str = $_POST['ids_str'];

	$cmd = "DELETE FROM `boscogen_store` WHERE `id` in ($ids_str)";
	$result = mysql_query($cmd);
	$response = $result;
	
// 新增店點
} else if($action == "insert_store") {

	$index = $_POST['index'];
	$amount = $_POST['amount'];
	
	$cmd = "INSERT INTO `boscogen_store` (`id`, `campaign_id`, `name`, `city`, `area`, `address`) VALUES (NULL, '$campaign_id', '', '', '', '');";
	$result = mysql_query($cmd);

	$index = mysql_insert_id();
	array_push($response['data'], array($index));
// 儲存全部
} else if($action == "save_all") {

	$campaign_id = $_POST['campaign_id'];
	$data = json_decode($_POST['data'], true);


	// 刪除舊的全部店點 by campaign_id
	$cmd = "SELECT * FROM `boscogen_store` WHERE `campaign_id` = '$campaign_id'";
	$result = mysql_query($cmd);
	if($result) {

		$num = mysql_num_rows($result);
		if($num > 0) {
			$cmd = "DELETE FROM `boscogen_store` WHERE `campaign_id` = '$campaign_id'";
			$result = mysql_query($cmd);
		}
	}
	
	foreach($data as $row) {

		//$id = $row[0];
		//$c_id = $row[1];
		$store_name = $row[2];
		$city = $row[3];
		$area = $row[4];
		$address = $row[5];
		
		if($store_name != NULL && $city != NULL && $area != NULL && $address != NULL) {

			$cmd = "INSERT INTO `boscogen_store` (`id`, `campaign_id`, `name`, `city`, `area`, `address`) VALUES (NULL, '$campaign_id', '$store_name', '$city', '$area', '$address');";
			mysql_query($cmd);
		}
	}

	array_push($response['data'], "OK");
}

echo json_encode($response);
*/
?>