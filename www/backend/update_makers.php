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
		if($area->email == "wonliao1117@gmail.com") {

			$time = floor($area->appointment / 1000);
			$date = date("Y-m-d", $time);
			$time = date("H:i", $time);

			$to = $area->email;
			$subject = "刊登成功通知！- go2gether大車隊共乘";
			$body = "$area->fb_name 小姐/先生<br />
			<br />
			感謝您使用go2gether大車隊共乘。<br />
			您的刊登需求已經成功上架於網站首頁囉！<br />
			<br />
			刊登詳情如下：<br />
			上車地點：$area->input_address<br />
			下車地點：$area->destination<br />
			出發日期：$date<br />
			出發時間：$time<br />";
			
			if($area->note != "") { $body .= "備註：$area->note<br />";	}
			if($area->phones != "") { $body .= "手機號碼：$area->phones<br />";	}
			if($area->email != "") { $body .= "電子信箱：$area->email<br />";	}
			
			$body .= "<br />
			當您收到此封系統通知信件後，將可於共乘網站的首頁，找到您的共乘需求圖標（顯示為黃色圖標）。<br />
			<br />
			在等候夥伴聯繫您的同時，您也可進行以下動作：<br />
			1. 資訊確認：回到共乘網站首頁，確認你的刊登資訊是否正確。<br />
			2. 夥伴聯繫：隨時注意來自夥伴的 電話/簡訊/email 聯繫訊息。<br />
			3. 查詢記錄：點選右上角側邊欄，選擇「刊登紀錄」，查看所有刊登過的需求。<br />
			4. 準時出發：當共乘夥伴主動聯繫並約好碰面後，請記得準時到達預定的上車地點。<br />
			5. 再次刊登：把下次要共乘的需求，前往完成吧！<br />
			   ＊go2gether大車隊共乘：<a href='https://goo.gl/gje0G6'>https://goo.gl/gje0G6</a><br />
			6. 提前於手機下載55688APP，讓您出門更加便利！<br />
			   ＊下載教學：<a href='http://app.taiwantaxi.com.tw/APPS/Mobile/Intro.aspx'>http://app.taiwantaxi.com.tw/APPS/Mobile/Intro.aspx</a><br />
			<br />
			<br />
			如果您有任何疑問，請隨時聯繫我們。<br />
			感謝您使用go2gether大車隊共乘<br />
			活動網站：<a href='https://goo.gl/gje0G6'>https://goo.gl/gje0G6</a><br />
			官方粉絲團：<a href='https://goo.gl/cVIwMp'>https://goo.gl/cVIwMp</a><br />
			<br />
			";

			sendMail($to, $subject, $body);
		}

		//echo "key($key) address(".$value->address.") expired_time($expired_time)<br />";
		$firebase->delete("makers/$key");
	}
}
?>