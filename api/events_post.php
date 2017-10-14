<?php
ob_start();
require_once("./config.php");

extract($_POST);
extract($_GET);

session_start();
include_once 'sessionChecker.php';


//$dt = '11-08-2017, 06:04';
//echo strtotime("11-08-2017 06:04");
//echo date('Y-m-d H:i:s', strtotime("11-08-2017 06:04"));
//echo file_get_contents('php://input'); //WORKING

function saveImage($inPath,$outPath) { 
	//Download images from remote server
	$in = fopen($inPath, "rb");
	$out = fopen($outPath, "wb");
	while ($chunk = fread($in,8192)) {
		fwrite($out, $chunk, 8192);
	}
	fclose($in);
	fclose($out);
}

//saveImage('3_1328387673947186_3294819508886074553_n.jpg','events/test.jpg');


$result = json_decode(file_get_contents('php://input'), true);

$eventsArr = array();

$isSuccess = true;

foreach ($result['events'] as $key => $value) {
	
	$name = $value['name'];
	$description = $value['description'];
	$startTime = date('Y-m-d H:i:s', strtotime($value['startTime']));
	$endTime = date('Y-m-d H:i:s', strtotime($value['endTime']));	
	$uid = $value['id'];
	
	if ($value['cover'] && $value['cover']['source'] !== '') {
		//$cover_source = $value['cover']['source'];
		$cover_source = 'events/'.$uid.'.jpg';
		saveImage($value['cover']['source'], 'events/'.$uid.'.jpg');
	} else {
		$cover_source = 'events/default.jpg';
	}
	
	$sql = "INSERT INTO $DB_NAME.`events` (`id`, `name`, `description`, `starttime`, `endtime`, `cover`, `uid`) VALUES ('', '$name', '$description', '$startTime', '$endTime', '$cover_source', '$uid')";
	

	$results = mysql_query($sql);	
	if (!$result) {
		$eventsArr[] = array('uid'=> false);
		//print_r('NO success');
	} else {
		$eventsArr[] = array('uid'=> $name);
		//print_r('success');
	}
	//print_r($sql);
	//header('Location:events_get.php');
}

$successObj = array('success' => true, 'events'=> $eventsArr);
print_r(json_encode($successObj));


?>