<?php
//ini_set("display_errors", true);
require_once("firebase/firebaseLib.php");
require_once("firebase/GeoHash.php");
use Lvht\GeoHash;


date_default_timezone_set("Asia/Taipei");


const DEFAULT_URL = 'https://go2gether-e78d4.firebaseio.com/';
const DEFAULT_TOKEN = 'FEDPrbRuQnPmgA8cPyprs4YRGKpityaBDaS6dNB5';

$firebase = new \Firebase\FirebaseLib(DEFAULT_URL, DEFAULT_TOKEN);

$current_time = time()."000";


$areas = json_decode( $firebase->get("areas") );
foreach($areas as $key => $area) {

	//$_area = $firebase->get( 'areas/'. $key );
	//$area = json_decode($_area);

	$expired_time = $area->expired_time;


	// 刊登過期，移除 makers
	if($current_time < $expired_time) {



        $lat = $area->latitude;
        $lng = $area->longitude;

        $_maker = $firebase->get( 'makers/'. $key );
        $maker = json_decode($_maker);
        if(!$maker) {

            echo "key($key) expired_time($expired_time)<br />";

            $hash = GeoHash::encode($lng,$lat);

            $data = array(
                "g" => $hash,
                "l" => array(
                        "0" => $lat,
                        "1" => $lng
                )
            );

            var_dump($data);
            $firebase->set("makers/$key", $data);

        }
	}

}

?>