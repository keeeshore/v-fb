<?php
session_start();
include_once 'sessionChecker.php';
require_once("./config.php");

extract($_POST);
extract($_GET);


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


		$getSql = "SELECT * FROM `events` WHERE `events`.`uid` = '$uid'";
		
		$getResult = mysql_query($getSql);

		if (mysql_affected_rows() != 0) {

			
			if ($value['cover'] && $value['cover']['source'] !== '') {
				$eventImgName = $IMG_EVENTS_DIR.'/event-'.$uid.'.jpg';	
				if (file_exists($IMG_EVENTS_DIR) || mkdir($IMG_EVENTS_DIR , 0777)) {
					saveImage($value['cover']['source'], $eventImgName);
				}
			}

			$sql = "UPDATE $DB_NAME.`events` SET `uid` = '$uid',`name` = '$name',`description` = '$description',`starttime` = '$startTime', `endtime` = '$endTime', `cover` = '$eventImgName' WHERE `events`.`uid` ='$uid' LIMIT 1";
			
			//$successObj = array('data' => mysql_affected_rows());
			$results = mysql_query($sql);


		} else {

			if ($value['cover'] && $value['cover']['source'] !== '') {
				$eventImgName = $IMG_EVENTS_DIR.'/event-'.$uid.'.jpg';	
				if (file_exists($IMG_EVENTS_DIR) || mkdir($IMG_EVENTS_DIR , 0777)) {
					saveImage($value['cover']['source'], $eventImgName);
				}
			}
		
			$sql = "INSERT INTO $DB_NAME.`events` (`id`, `name`, `description`, `starttime`, `endtime`, `cover`, `uid`) VALUES ('', '$name', '$description', '$startTime', '$endTime', '$eventImgName', '$uid')";

			//$successObj = array('sql' => $sql);
			$results = mysql_query($sql);

		}

			
		if (!$results) {
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