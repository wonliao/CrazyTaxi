#!/usr/bin/php -q
<?php
ini_set("display_errors", true);
require_once("firebase/firebaseLib.php");

const DEFAULT_URL = 'https://go2gether-e78d4.firebaseio.com/';
const DEFAULT_TOKEN = 'FEDPrbRuQnPmgA8cPyprs4YRGKpityaBDaS6dNB5';

$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);


$areas = json_decode( $firebase->get("areas") );
//var_dump($areas);


$current_time = time()."000";
//echo "current_time($current_time)<br />";

foreach($areas as $key => $value) {

	$expired_time = $value->expired_time;
	//echo "key($key) address(".$value->address.") expired_time($expired_time)<br />";
	
	// 刊登過期，移除 makers
	if($current_time > $expired_time) {

		//echo "key($key) address(".$value->address.") expired_time($expired_time)<br />";
		$firebase->delete("makers/$key");
	}
}



?>