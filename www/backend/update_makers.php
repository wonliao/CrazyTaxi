#!/usr/bin/php -q
<?php
ini_set("display_errors", true);
require_once("firebase/firebaseLib.php");
require_once("send_mail.php");

date_default_timezone_set("Asia/Taipei");
 

const DEFAULT_URL = 'https://go2gether-e78d4.firebaseio.com/';
const DEFAULT_TOKEN = 'FEDPrbRuQnPmgA8cPyprs4YRGKpityaBDaS6dNB5';

$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);

$current_time = time()."000";

$makers = json_decode( $firebase->get("makers") );
foreach($makers as $key => $maker) {

	$_area = $firebase->get( 'areas/'. $key );
	$area = json_decode($_area);

	$expired_time = $area->expired_time;
	// 刊登過期，移除 makers
	if($current_time > $expired_time) {

		// 寄送 email
		$time = floor($area->appointment / 1000);
		$date = date("Y-m-d", $time);
		$time = date("H:i", $time);

		$to = $area->email;
		$subject = "您的共乘需求時間已到期通知！- go2gether大車隊共乘";
		$body = "$area->fb_name 小姐/先生<br />
		<br />
		感謝您使用go2gether大車隊共乘。<br />
		您的刊登需求已經到期，網站首頁將不再顯示該筆刊登囉！<br />
		<br />
		已到期的刊登詳情如下：<br />
		上車地點：$area->input_address<br />
		下車地點：$area->destination<br />
		出發日期：$date<br />
		出發時間：$time<br />";
		
		if($area->note != "") { $body .= "備註：$area->note<br />";	}
		if($area->phones != "") { $body .= "手機號碼：$area->phones<br />";	}
		if($area->email != "") { $body .= "電子信箱：$area->email<br />";	}
		
		$body .= "<br />
		<font color='red'>為了提供您更優質的共乘體驗，希望您對於此次共乘網站使用的經驗，</font><br />
		<font color='red'>有任何建議或意見提供，請分享給我們！</font><br />
		<font color='red'>go2gether大車隊共乘 使用體驗分享：</font><br />
		<a href='https://goo.gl/forms/DWJF2ekv9BdWvy663'>https://goo.gl/forms/DWJF2ekv9BdWvy663</a><br />
		<br />
		<br />
		<br />
		如果您有任何疑問，請隨時聯繫我們。<br />
		感謝您使用go2gether大車隊共乘<br />
		活動網站：<a href='https://goo.gl/gje0G6'>https://goo.gl/gje0G6</a><br />
		官方粉絲團：<a href='https://goo.gl/cVIwMp'>https://goo.gl/cVIwMp</a><br />
		<br />
		";

		sendMail($to, $subject, $body);

		//echo "key($key) address(".$value->address.") expired_time($expired_time)<br />";
		$firebase->delete("makers/$key");
	}
}
?>