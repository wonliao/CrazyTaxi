<?php
# FileName="Connection_php_mysql.htm"
# Type="MYSQL"
# HTTP="true"
$hostname_news = "localhost";
$news = "cooperation";
$username_news = "wonliao";
$password_news = "a11111111";
$link = mysql_pconnect($hostname_news, $username_news, $password_news) or trigger_error(mysql_error(),E_USER_ERROR); 
?>