<?php
require 'PHPMailer/PHPMailerAutoload.php';

$to = $_POST["to"];
$subject = $_POST["subject"];
$body = $_POST["body"];
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
		echo "Mailer Error: " . $mail->ErrorInfo;
	} else {
		echo "Message sent!";
	}
}
?>
