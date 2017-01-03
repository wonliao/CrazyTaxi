<?php
ini_set("display_errors", true);
header('Access-Control-Allow-Origin: *');  
require 'PHPMailer/PHPMailerAutoload.php';


$to = $_POST["to"];
$subject = $_POST["subject"];
$body = $_POST["body"];

/*
// test
$to = "wonliao1117@gmail.com";
$subject = "刊登成功通知！- go2gether大車隊共乘";
$body = "XXX(FB暱稱) 小姐/先生<br />
<br />
感謝您使用go2gether大車隊共乘。<br />
您的刊登需求已經成功上架於網站首頁囉！<br />
<br />
刊登詳情如下：<br />
上車地點：<br />
下車地點：<br />
出發日期：<br />
出發時間：<br />
備註：（若無則不顯示）<br />
手機號碼：（若無則不顯示）<br />
電子信箱：（若無則不顯示）<br />
<br />
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
*/


if($to != "" && $subject != "" && $body != "") {
	sendMail($to, $subject, $body);
}


function sendMail($to, $subject, $body) {

	$mail= new PHPMailer(); //建立新物件        
	$mail->IsSMTP(); //設定使用SMTP方式寄信        
	$mail->SMTPAuth = true; //設定SMTP需要驗證        
	$mail->SMTPSecure = "ssl"; // Gmail的SMTP主機需要使用SSL連線   
	$mail->Host = "smtp.gmail.com"; //Gamil的SMTP主機        
	$mail->Port = 465;  //Gamil的SMTP主機的SMTP埠位為465埠。        
	$mail->CharSet = "UTF-8"; //設定郵件編碼        
	
	$mail->Username = "go2gether2016@gmail.com"; //設定驗證帳號        
	$mail->Password = "go2gether55688"; //設定驗證密碼        
	
	$mail->From = "go2gether2016@gmail.com"; //設定寄件者信箱        
	$mail->FromName = "go2gether大車隊共乘"; //設定寄件者姓名        
	
	$mail->Subject = $subject; // "共乘通知";
	
	//$body = "共乘出發";//'测试邮件,附上中文乱码解决方法:' . "<br>" .'123'; 
	$mail->MsgHTML( $body );
	
	$mail->IsHTML(true); //設定郵件內容為HTML        
	$mail->AddAddress($to, "親愛的用戶"); //設定收件者郵件及名稱        
	
	if(!$mail->Send()) {
		//echo "Mailer Error: " . $mail->ErrorInfo;
	} else {
		//echo "Message sent!";
	}
}
?>
