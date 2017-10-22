<?php
ob_start();
require_once("./config.php");

extract($_POST);
extract($_GET);

session_start();
include_once 'sessionChecker.php';

include_once 'common.php';


//$dt = '11-08-2017, 06:04';
//echo strtotime("11-08-2017 06:04");
//echo date('Y-m-d H:i:s', strtotime("11-08-2017 06:04"));
//echo file_get_contents('php://input'); //WORKING

//saveImage('3_1328387673947186_3294819508886074553_n.jpg','events/test.jpg');


$result = json_decode(file_get_contents('php://input'), true);

$eventsArr = array();

$isSuccess = true;

if (is_array($result['events']) || is_object($result['events'])) {

	foreach ($result['events'] as $key => $value) {
	
		$name = $value['name'];
		$description = $value['description'];
		$startTime = date('Y-m-d H:i:s', strtotime($value['startTime']));
		$endTime = date('Y-m-d H:i:s', strtotime($value['endTime']));	
		$uid = $value['id'];
		$eventImgName = $IMG_EVENTS_DIR.'/default.jpg';

		if ($value['cover'] && $value['cover']['source'] !== '') {
			$eventImgName = $IMG_EVENTS_DIR.'/event-'.$uid.'.jpg';	
			if (file_exists($IMG_EVENTS_DIR) || mkdir($IMG_EVENTS_DIR , 0777)) {
				saveImage($value['cover']['source'], $eventImgName);
			}
		}
		
		$sql = "INSERT INTO $DB_NAME.`events` (`id`, `name`, `description`, `starttime`, `endtime`, `cover`, `uid`) VALUES ('', '$name', '$description', '$startTime', '$endTime', '$eventImgName', '$uid')";

		$results = mysql_query($sql);	
		if (!$result) {
			$eventsArr[] = array('uid'=> false);
		} else {
			$eventsArr[] = array('uid'=> $name);
		}
		//print_r($sql);
		//header('Location:events_get.php');
	}
}


$successObj = array('success' => true, 'events'=> $eventsArr);
print_r(json_encode($successObj));


?>