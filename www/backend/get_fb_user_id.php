<?php

$user_id = $_GET["user_id"];

$url = "https://izitools.com/api/get-facebook-id-from-scoped-id?token=ynuGkNyTliCl67tkHeNHnDEMQj-0-CXm&scoped_id=$user_id&more_info=0";

$json = file_get_contents($url);

echo $json;
/*
$obj = json_decode($json);
var_dump( $obj->data );
echo $obj->data->id;
*/


?>