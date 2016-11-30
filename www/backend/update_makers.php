#!/usr/bin/php -q
<?php
ini_set("display_errors", true);
require_once("firebase/firebaseLib.php");

require_once("send_mail.php");

const DEFAULT_URL = 'https://go2gether-e78d4.firebaseio.com/';
const DEFAULT_TOKEN = 'FEDPrbRuQnPmgA8cPyprs4YRGKpityaBDaS6dNB5';

$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);

$makers = json_decode( $firebase->get("makers") );
foreach($makers as $key => $maker) {

	$_area = $firebase->get( 'areas/'. $key );
	$area = json_decode($_area);

	$expired_time = $area->expired_time;
	// 刊登過期，移除 makers
	if($current_time > $expired_time) {

		// 寄送 email
		if($area->email == "wonliao1117@gmail.com") {

			$email = $area->email;
			$subject = "共乘通知";
			$body = "共乘已結束";
			sendMail($email, $subject, $body);
		}

		//echo "key($key) address(".$value->address.") expired_time($expired_time)<br />";
		$firebase->delete("makers/$key");
	}
}
?>